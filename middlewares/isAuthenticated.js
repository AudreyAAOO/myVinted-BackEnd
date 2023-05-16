//! import du model 'User'
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
	try {
		if (req.headers.authorization) {
			// le token est dans req.headers.authorization
			const user = await User.findOne({ // Chercher dans la BDD un user qui a ce token
				token: req.headers.authorization.replace("Bearer ", ""),
			}).select("account _id");
			console.log("je suis dans le if req.headers.authorization");
			if (!user) {
				console.log("je suis dans le if !user");
				return res.status(401).json({ error: "⛔ Unauthorized" });

			} else {
				req.user = user;
				console.log("je suis dans le else !user");
				// On crée une clé "user" dans req. La route dans laquelle le middleware est appelé pourra avoir accès à req.user
				return next();
			}
			
		} else {
			console.log("je suis dans le else req.headers.authorization");
			return res.status(401).json({ error: "Unauthorized ⛔" });
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = isAuthenticated;
