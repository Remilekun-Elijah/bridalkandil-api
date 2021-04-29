// jshint esversion: 8
const DB = require("./database"),
    db = new DB();
users = DB.model("user", db.userSchema);

class Helper {
    static validate() {
        function pwd(val) {
            const char = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
            return char.test(val);
        }

        function num(val) {
            const char = /[ `!@#$%^&*()_\-=\[\]{};':"\\|,.<>\/?~a-zA-Z]/;
            return !char.test(val);
        }

        function isEmpty(val) {
            return val.trim() === "" ? true : false;
        }

        return { pwd, num, isEmpty };
    }

    static async isLoggedIn(data) {
        try {
            const { email } = data;
            let user = await users.findOne({ email }).select("-password");
            // console.log(data);
            return user;
        } catch (e) {
            // console.log(e);
        }
    }
}

module.exports = Helper;