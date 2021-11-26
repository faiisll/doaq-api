const db = require('../models/index');
const Feedback = require('../models').Feedback;
const Op = db.Sequelize.Op;

module.exports = {
    getAll(req, res) {
        return Feedback.findAll({
            include: [],
            order: [['createdAt', 'DESC']]
        }).then(feed => {

            if(!feed.length){
                return res.status(200).send({
                    message: "no records.",
                    data: []
                });
            }
            return res.status(200).send({data: feed});
        }).catch(err => res.status(400).send(err))
    },

    add(req, res) {
       return Feedback.create({
           email: req.body.email,
           message: req.body.message
       }).then(feed => res.status(200).send({
           message: "Success added feedback.",
           data: feed
       })).catch(err => res.status(400).send(err));
    },

    async delete(req, res) {
        try{
            let feed = await Feedback.findByPk(req.params.id);
            // console.log(feed);
            if(!feed || feed === null){
                return feed.res(400).send({
                    message: "Feed not found."
                });
            }

            return feed.destroy().then(() => res.status(200).send({
                message: "delete success.",
                data: feed
            })).catch(err => res.status(400).send(err));
            

        }catch(err){
            return res.status(400).send(err);
        }
    }
}

