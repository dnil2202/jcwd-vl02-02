const { transport } = require('../config/nodemailer');
const { dbConf, dbQuery } = require('../config/db');
const { hashPassword, createToken } = require('../config/encript');
var fs = require('fs')
var Handlebars = require('handlebars');
const path = require('path');

module.exports = {
  getData: async (req, res) => {
    try {
      let dataUser = await dbQuery(`Select * from user u JOIN status s on u.status_id = s.idstatus`)
      res.status(200).send(dataUser)
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },

  register: async (req, res) => {
    try {
      let { fullname, username, email, phone_number, password } = req.body;

      //Get email from database
      const availableEmail = await dbQuery(`Select email from user where email = ${dbConf.escape(email)}`)
      const availableUsername = await dbQuery(`Select username from user where username = ${dbConf.escape(username)}`)
      if (availableUsername.length <= 0) {
        if (availableEmail.length <= 0) {
          let sqlInsert = await dbQuery(`INSERT INTO user (fullname,username, email, phone_number, password)values(${dbConf.escape(fullname)}, ${dbConf.escape(username)}, ${dbConf.escape(email)},${dbConf.escape(phone_number)},${dbConf.escape(hashPassword(password))})`)
          if (sqlInsert.insertId) {
            console.log(fullname)
            let sqlGet = await dbQuery(`Select iduser, email, status_id from user where iduser=${sqlInsert.insertId}`)
            let token = createToken({ ...sqlGet[0] }, '1h')

            // Send Email
            var source = fs.readFileSync(path.join(__dirname, '../template-email/emailConfirmation.hbs'), 'utf-8')
            var template = Handlebars.compile(source)
            var data = { 'fullname': fullname, 'frontend': process.env.FE_URL, 'token': token }
            await transport.sendMail({
              from: 'MEDCARE ADMIN',
              to: sqlGet[0].email,
              subject: 'verification account',
              html: template(data)
            })
            res.status(200).send({
              success: true,
              message: 'Register Success',
              token
            })
          }
        }
        else {
          res.status(401).send({
            success: false,
            message: 'Email is used',
            error: 'email'
          })
        }
      } else {
        res.status(401).send({
          success: false,
          message: 'Username is used',
          error: 'username'
        })
      }
    } catch (error) {
      console.log('Error query SQL :', error);
      res.status(500).send({
        success: false,
        message: 'error query', error
      });
    }
  },

  login: async (req, res) => {
    try {
      let { email, password } = req.body
      let loginUser = await dbQuery(`Select u.iduser, u.fullname, u.username, u.email, u.role, u.phone_number, u.gender, u.birthdate, u.profile_pic, u.status_id, s.status_name from user u JOIN status s on u.status_id=s.idstatus
        WHERE ${dbConf.escape(email).includes('.co') ? `u.email=${dbConf.escape(email)}` :
          `u.username=${dbConf.escape(email)}`}
        and u.password=${dbConf.escape(hashPassword(password))}`)
      console.log(loginUser[0])
      if (loginUser.length > 0) {
        let token = createToken({ ...loginUser[0] })
        if (loginUser[0].status_name === 'Verified') {
          let cartUser = await dbQuery(`Select u.iduser, p.idproduct, p.product_name, p.price,
                p.category_id, p.description, p.aturan_pakai, p.dosis,p.picture, p.netto_stock, p.netto_unit, p.default_unit,
                c.product_id, c. quantity, p.price*c.quantity as total_price from user u
                JOIN cart c ON u.iduser=c.user_id
                JOIN product p ON p.idproduct = c.product_id WHERE c.user_id = ${dbConf.escape(loginUser[0].iduser)}`)

          res.status(200).send({
            ...loginUser[0],
            cart: cartUser,
            token
          })
        } else {
          await dbQuery(`UPDATE user set token=${dbConf.escape(token)} WHERE iduser=${dbConf.escape(loginUser[0].iduser)}`)
          res.status(200).send({
            status: 'Unverified',
            ...loginUser[0],
            token
          })
        }
      } else {
        res.status(500).send({
          status: false,
          message: `The username you entered doesn't belong to an account. Please check your username and password try again.`
        })
      }
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },

  keeplogin: async (req, res) => {
    try {
      let resultUser = await dbQuery(`Select u.iduser, u.fullname, u.username, u.email, u.role, u.phone_number, u.gender, u.birthdate, u.profile_pic, u.status_id, s.status_name from user u JOIN status s on u.status_id=s.idstatus
            WHERE u.iduser=${dbConf.escape(req.dataToken.iduser)}`)


      if (resultUser.length > 0) {

        let cartUser = await dbQuery(`Select u.iduser, p.idproduct, p.product_name, p.price,
                    p.category_id, p.description, p.aturan_pakai, p.dosis,p.picture, p.netto_stock, p.netto_unit, p.default_unit,
                    c.product_id, c. quantity, p.price*c.quantity as total_price from user u
                    JOIN cart c ON u.iduser=c.user_id
                    JOIN product p ON p.idproduct = c.product_id WHERE c.user_id = ${dbConf.escape(resultUser[0].iduser)}`)

        let token = createToken({ ...resultUser[0] })
        res.status(200).send({
          ...resultUser[0],
          cart: cartUser,
          token
        })
      }
    } catch (error) {
      console.log('ERROR QUERY SQL :', error);
      res.status(500).send(error)
    }

  },

  verification: async (req, res) => {
    let isToken = await dbQuery(`SELECT * FROM user where token =${dbConf.escape(req.token)}`)
    try {
      if (isToken.length > 0) {
        await dbQuery(`UPDATE user set status_id=2 where iduser = ${dbConf.escape(req.dataToken.iduser)}`)
        await dbQuery(`UPDATE user set token = 'expired' where iduser = ${dbConf.escape(req.dataToken.iduser)}`)
        let resultUser = await dbQuery(`Select u.iduser, u.fullname, u.username, u.email, u.role, u.phone_number, u.gender, u.birthdate, u.profile_pic, u.status_id, s.status_name from user u JOIN status s on u.status_id=s.idstatus WHERE iduser = ${dbConf.escape(req.dataToken.iduser)} `)
        let token = createToken({ ...resultUser[0] })
        res.status(200).send({
          success: true,
          message: 'Verify Success',
          dataLogin: {
            ...resultUser[0],
            token
          },
          error: ''
        })
      } else {
        let resultUser = await dbQuery(`Select u.iduser, u.fullname, u.username, u.email, u.role, u.phone_number, u.gender, u.birthdate, u.profile_pic, u.token, u.status_id, s.status_name from user u JOIN status s on u.status_id=s.idstatus WHERE iduser = ${dbConf.escape(req.dataToken.iduser)} `)
        if (resultUser[0].token || resultUser[0].token === 'expired') {
          res.status(500).send({
            success: false,
            message: "Email has been expired",
            code: 'EMAIL_EXPIRED'
          });
        } else {
          await dbQuery(`UPDATE user set status_id=2 where iduser = ${dbConf.escape(req.dataToken.iduser)}`)
          await dbQuery(`UPDATE user set token = 'expired' where iduser = ${dbConf.escape(req.dataToken.iduser)}`)
          let resultUser = await dbQuery(`Select u.iduser, u.fullname, u.username, u.email, u.role, u.phone_number, u.gender, u.birthdate, u.profile_pic, u.status_id, s.status_name from user u JOIN status s on u.status_id=s.idstatus WHERE iduser = ${dbConf.escape(req.dataToken.iduser)} `)
          if (resultUser.length > 0) {
            let token = createToken({ ...resultUser[0] })
            res.status(200).send({
              success: true,
              message: 'Verify Success',
              dataLogin: {
                ...resultUser[0],
                token
              },
              error: ''
            })
          } else {
            res.status(401).send({
              success: false,
              message: 'Invalid Verification'
            })
          }
        }
      }
    } catch (error) {
      res.status(500).send(error)
    }

  },

  resendVerif: async (req, res) => {
    try {
      let sqlInsert = await dbQuery(`Select iduser,fullname,email,token, status_id From user WHERE email='${req.query.email}'`)
      var source = fs.readFileSync(path.join(__dirname, '../template-email/emailConfirmation.hbs'), 'utf-8')
      var template = Handlebars.compile(source)
      var data = { 'fullname': sqlInsert[0].fullname, 'frontend': process.env.FE_URL, 'token': sqlInsert[0].token }
      await transport.sendMail({
        from: 'MEDCARE ADMIN',
        to: sqlInsert[0].email,
        subject: 'verification account',
        html: template(data)
      })
      res.status(200).send({
        success: true,
        message: 'Register Success'
      })
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },

  editProfile: async (req, res) => {
    try {
      let data = JSON.parse(req.body.data)
      let availableUsername = await dbQuery(`Select username from user where username = ${dbConf.escape(data.username)}`)
      let availableEmail = await dbQuery(`Select email from user where email = ${dbConf.escape(data.email)}`)
      let isUsername = await dbQuery(`Select username from user where iduser = ${req.dataToken.iduser}`)
      let isEmail = await dbQuery(`Select email from user where iduser = ${req.dataToken.iduser}`)
      if (availableUsername.length <= 0 || data.username === isUsername[0].username) {
        if (availableEmail.length <= 0 || data.email === isEmail[0].email) {
          // jika email berubah
          if (data.email != isEmail[0].email) {
            let newEmail = data.email
            data.email = isEmail[0].email
            let dataInput = []
            for (const key in data) {
              dataInput.push(`${key}=${dbConf.escape(data[key])}`)
            }
            if (req.files.length > 0) {
              dataInput.push(`profile_pic=${dbConf.escape(`/img_profile${req.files[0].filename}`)}`)
              await dbQuery(`UPDATE user set ${dataInput.join(',')}where iduser =${req.dataToken.iduser}`)

            } else {
              await dbQuery(`UPDATE user set ${dataInput.join(',')}where iduser =${req.dataToken.iduser}`)
            }
            let resultUser = await dbQuery(`Select u.iduser, u.fullname, u.username, u.email, u.role, u.phone_number, u.gender, u.birthdate, u.profile_pic, u.status_id, s.status_name from user u JOIN status s on u.status_id=s.idstatus
              WHERE u.iduser=${dbConf.escape(req.dataToken.iduser)}`)

            let cartUser = await dbQuery(`Select u.iduser, p.idproduct, p.product_name, p.price,
                      p.category_id, p.description, p.aturan_pakai, p.dosis,p.picture, p.netto_stock, p.netto_unit, p.default_unit,
                      c.product_id, c. quantity, p.price*c.quantity as total_price from user u
                      JOIN cart c ON u.iduser=c.user_id
                      JOIN product p ON p.idproduct = c.product_id WHERE c.user_id = ${dbConf.escape(resultUser[0].iduser)}`)

            let addressUser = await dbQuery(`Select * from address a JOIN status s on a.status_id = s.idstatus where a.user_id=${dbConf.escape(resultUser[0].iduser)}`)

            let token = createToken({ ...resultUser[0], newEmail })
            var source = fs.readFileSync(path.join(__dirname, '../template-email/changeEmailConfirmation.hbs'), 'utf-8')
            var template = Handlebars.compile(source)
            var dataEmail = { 'username': resultUser[0].username, 'fe_url': process.env.FE_URL, 'token': token }
            await transport.sendMail({
              from: 'MEDCARE ADMIN',
              to: newEmail,
              subject: 'Change Email',
              html: template(dataEmail)
            })
            res.status(200).send({
              ...resultUser[0],
              cart: cartUser,
              address: addressUser,
              token
            })
          } else {
            // Jikae email tidak berubah
            let dataInput = []
            for (const key in data) {
              dataInput.push(`${key}=${dbConf.escape(data[key])}`)
            }
            if (req.files.length > 0) {
              dataInput.push(`profile_pic=${dbConf.escape(`/img_profile${req.files[0].filename}`)}`)
              await dbQuery(`UPDATE user set ${dataInput.join(',')}where iduser =${req.dataToken.iduser}`)
            } else {
              await dbQuery(`UPDATE user set ${dataInput.join(',')}where iduser =${req.dataToken.iduser}`)
            }
            let resultUser = await dbQuery(`Select u.iduser, u.fullname, u.username, u.email, u.role, u.phone_number, u.gender, u.birthdate, u.profile_pic, u.status_id, s.status_name from user u JOIN status s on u.status_id=s.idstatus
              WHERE u.iduser=${dbConf.escape(req.dataToken.iduser)}`)

            let cartUser = await dbQuery(`Select u.iduser, p.idproduct, p.product_name, p.price,
                      p.category_id, p.description, p.aturan_pakai, p.dosis,p.picture, p.netto_stock, p.netto_unit, p.default_unit,
                      c.product_id, c. quantity, p.price*c.quantity as total_price from user u
                      JOIN cart c ON u.iduser=c.user_id
                      JOIN product p ON p.idproduct = c.product_id WHERE c.user_id = ${dbConf.escape(resultUser[0].iduser)}`)

            let addressUser = await dbQuery(`Select * from address a JOIN status s on a.status_id = s.idstatus where a.user_id=${dbConf.escape(resultUser[0].iduser)}`)

            let token = createToken({ ...resultUser[0] })

            res.status(200).send({
              ...resultUser[0],
              cart: cartUser,
              address: addressUser,
              token
            })
          }
        } else {
          res.status(401).send({
            status: false,
            message: 'Email not available'
          })
        }
      } else {
        res.status(401).send({
          status: false,
          message: 'Username not available'
        })
      }
    } catch (error) {
      console.log(error)
      res.status(500).send({
        message: 'Error'
      })
    }
  },

  changePass: async (req, res) => {
    try {
      let { password, newPassword } = req.body
      userPass = await dbQuery(`Select * from user where password=${dbConf.escape(hashPassword(password))}`)
      if (userPass.length > 0) {
        await dbQuery(`UPDATE user set password=${dbConf.escape(hashPassword(newPassword))} WHERE iduser=${dbConf.escape(req.dataToken.iduser)}`)
        res.status(200).send({
          success: true,
          message: 'Change Password Success'
        })
      } else {
        res.status(401).send({
          success: false,
          message: 'Please Input Correct Password'
        })
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: 'Change Password Failed'
      })

    }
  },

  sendReset: async (req, res) => {
    try {
      let userEmail = await dbQuery(`Select iduser, email,username from user where email = ${dbConf.escape(req.body.email)} `)
      if (userEmail[0].email) {
        let token = createToken({...userEmail[0] })
        console.log(token)
        var source = fs.readFileSync(path.join(__dirname, '../template-email/resetPasswordConfirmation.hbs'), 'utf-8')
        var template = Handlebars.compile(source)
        var data = { 'username': userEmail[0].username, 'fe_url': process.env.FE_URL, 'token': token }
        await transport.sendMail({
          from: 'MEDCARE ADMIN',
          to: userEmail[0].email,
          subject: 'Reset Password',
          html: template(data)
        })
        res.status(200).send({
          success: true,
          message: 'Register Success',
          token
        })
      } else {
        res.status(401).send({
          success: false,
          message: 'Wrong Email'
        })
      }
    } catch (error) {
      console.log(error)
      res.status(500).send({
        success: false,
        message: 'Error Request'
      })
    }
  },

  resetPass: async (req, res) => {
    try {
      let dataUser = await dbQuery(`Select * from user where iduser=${dbConf.escape(req.dataToken.iduser)}`)
      if (dataUser.length > 0) {
        await dbQuery(`UPDATE user set password=${dbConf.escape(hashPassword(req.body.password))} WHERE iduser=${dbConf.escape(req.dataToken.iduser)}`)
        res.status(200).send({
          success: true,
          message: 'Reset Password Success'
        })
      } else {
        res.status(401).send({
          success: false,
          message: 'error'
        })
      }
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },

  changeEmail: async (req, res) => {
    try {
      if (req.dataToken.iduser) {
        await dbQuery(`UPDATE user set email=${dbConf.escape(req.dataToken.newEmail)} WHERE iduser=${dbConf.escape(req.dataToken.iduser)}`)
        let resultUser = await dbQuery(`Select u.iduser, u.fullname, u.username, u.email, u.role, u.phone_number, u.gender, u.birthdate, u.profile_pic, u.status_id, s.status_name from user u JOIN status s on u.status_id=s.idstatus WHERE u.iduser=${dbConf.escape(req.dataToken.iduser)}`)
        let cartUser = await dbQuery(`Select u.iduser, p.idproduct, p.product_name, p.price,
        p.category_id, p.description, p.aturan_pakai, p.dosis,p.picture, p.netto_stock, p.netto_unit, p.default_unit,
        c.product_id, c. quantity, p.price*c.quantity as total_price from user u
        JOIN cart c ON u.iduser=c.user_id
        JOIN product p ON p.idproduct = c.product_id WHERE c.user_id = ${dbConf.escape(resultUser[0].iduser)}`)

        let addressUser = await dbQuery(`Select * from address a JOIN status s on a.status_id = s.idstatus where a.user_id=${dbConf.escape(resultUser[0].iduser)}`)

        let token = createToken({ ...resultUser[0] })
        res.status(200).send({
          ...resultUser[0],
          cart: cartUser,
          address: addressUser,
          token
        })

      } else {
        res.status(401).send({
          success: false,
          message: 'Change Email denied'
        })
      }

    } catch (error) {
      console.log(error)
    }
  },

  googleLogin : async (req,res)=>{
    let availableEmail = await dbQuery(`Select email from user where email = ${dbConf.escape(req.user.emails[0].value)}`)
    if(availableEmail.length >0){
      let loginUser = await dbQuery(`Select u.iduser, u.fullname, u.username, u.email, u.role, u.phone_number, u.gender, u.birthdate, u.profile_pic, u.status_id, s.status_name from user u JOIN status s on u.status_id=s.idstatus WHERE u.email = ${dbConf.escape(req.user.emails[0].value) }`)
      if(loginUser.length > 0){
        let token = createToken ({...loginUser[0]})
        res.redirect(process.env.FE_URL+`/login?_t=${token}`)
      } 
    }else{
      let register = await dbQuery(`INSERT INTO user (fullname,username, email, phone_number, password)values(${dbConf.escape(req.user.displayName)}, ${dbConf.escape(req.user.name.givenName)}, ${dbConf.escape(req.user.emails[0].value)}, +62 ,${dbConf.escape(hashPassword(req.user.id))})`)
      if(register.insertId){
        let sqlGet = await dbQuery(`Select iduser, email, status_id from user where iduser=${register.insertId}`)
        let token = createToken({ ...sqlGet[0] }, '1h')
        // Send Email
          var source = fs.readFileSync(path.join(__dirname, '../template-email/emailConfirmation.hbs'), 'utf-8')
          var template = Handlebars.compile(source)
          var data = { 'fullname': req.user.displayName, 'frontend': process.env.FE_URL, 'token': token }
              await transport.sendMail({
              from: 'MEDCARE ADMIN',
              to: sqlGet[0].email,
              subject: 'verification account',
              html: template(data)
              })
              }
              res.redirect(`${process.env.FE_URL}?_status=googlesucces`)
    }
  },



}