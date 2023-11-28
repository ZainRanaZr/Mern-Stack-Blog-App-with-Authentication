const Joi = require("joi");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const userDTO = require("../dto/user");
const JWTService = require("../services/JWTService");
const RefreshToken = require("../models/token");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const authController = {
  async register(req, res, next) {
    // 1. validate user input
    const userRegisterSchema = Joi.object({
      first_name: Joi.string().min(3).max(30).required(),
      last_name: Joi.string().max(30).required(),
      username: Joi.string().min(5).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });
    const { error } = userRegisterSchema.validate(req.body);
    // 2. if error in validate -> return error via middleware
    if (error) {
      return next(error);
    }

    // 3. if email or username is already registered -> return an error
    const { first_name, last_name, username, email, password } = req.body;

    try {
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email already registered, use another email!",
        };
        return next(error);
      }
      if (usernameInUse) {
        const error = {
          status: 409,
          message: "Username already registered, use another username!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    // 4. password hash
    // 123abc -> wqey18230912dsambdweyqwuey1298eh
    const hashedPassword = await bcrypt.hash(password, 10);
    // 5. store user date in db
    let accessToken;
    let refreshToken;
    let user;
    try {
      const UserToRegister = new User({
        first_name: first_name,
        last_name: last_name,
        username: username,
        email: email,
        password: hashedPassword,
      });
      user = await UserToRegister.save();

      // token Generation
      accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
      refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
    } catch (error) {
      return next(error);
    }

    // store refreshToken in Db
    await JWTService.storeRefreshToken(refreshToken, user._id);

    // send token to cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    // 6. reponse send
    const userDto = new userDTO(user);
    return res.status(201).json({ user: userDto, auth: true });
  },
  async login(req, res, next) {
    // 1. validate user input
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern).required(),
    });
    const { error } = userRegisterSchema.validate(req.body);

    // 2. if error in validate -> return error via middleware
    if (error) {
      return next(error);
    }
    // 3. match username and password
    const { username, password } = req.body;
    let user;
    try {
      user = await User.findOne({ username: username });

      if (!user) {
        const error = {
          status: 401,
          message: "Username is invalid, please enter valid username!",
        };
        return next(error);
      }
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Password is invalid, please enter valid password!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    // 4. return response
    const accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

    // update refresh token in Db
    try {
      await RefreshToken.updateOne(
        {
          _id: user._id,
        },
        {
          token: refreshToken,
        },{
          upsert: true
        }
      );
    } catch (error) {
      return next(error)
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    const userDto = new userDTO(user);
    return res.status(200).json({ user: userDto, auth: true });
  },
  async logout(req, res, next){
    // 1: delete refreshToken from Db
    const {refreshToken} = req.cookies;
    try {
      await RefreshToken.deleteOne({token: refreshToken})
    } catch (error) {
      return next(error)
    }
    // delete cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    // 2: response
    res.status(200).json({user: null, auth: false});
  },
  async refresh(req, res, next){
    // 1: get refreshToken from cookies
    const originalRefreshToken = req.cookies.refreshToken;

    // 2: verify refreshToken
    let id;
    try {
      id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 401,
        message: 'Unauthorized'
      }
      return next(error);
    }

    try {
      const match = RefreshToken.findOne({_id: id, token: originalRefreshToken});

      if(!match){
        const error = {
           status: 401,
           message: 'Unauthorized'
        }
        return next(error);
      }
    } catch (e) {
      return next(e);
    }

    // 3: generate new tokens
    try {
      const accessToken = JWTService.signAccessToken({_id: id}, '30m');

      const refreshToken = JWTService.signRefreshToken({_id: id}, '60m');

      await RefreshToken.updateOne({_id: id}, {token: refreshToken});

      res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
      })

      res.cookie('refreshToken', refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
      })
    } catch (e) {
      return next(e)
    }
    // 4: update Db
    const user = await User.findOne({_id: id});

    const userDto = new userDTO(user);

    // 5: return reponse
    return res.status(200).json({user: userDto, auth: true})
  }
};

module.exports = authController;
