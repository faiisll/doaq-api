const db = require('../models/index');
const Feedback = require('../models').Feedback;
const Op = db.Sequelize.Op;
const getPage = require('../helper/getPage');

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

    async getPage(req, res){
        const {page, size} = req.query;
        try{
            const {limit, offset} = getPage(page, size);
            const feed = await Feedback.findAndCountAll({
                limit,
                offset
            });

            const current = page ? page : 0;
            const totalPages = Math.ceil(feed.count / limit);

            return res.status(200).send({current, totalPages, ...feed});

        }catch(err){
            // console.log(err);
            return res.status(400).send(err);

        }
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

