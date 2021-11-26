const db = require("../models/index");
const Category = require("../models").Category;
const Doa = require("../models").Doa;
const Detail = require("../models").Detail;
const Op = db.Sequelize.Op;

module.exports = {
    async verifyCategory(req,res, next){
        const cat = await Category.findByPk(req.body.category_id);

        if(!cat){
            return res.status(404).send({
                message: "error",
                error: "Invalid Category Id."
            });
        }

        next();
    },
    async verifyDoa(req, res, next) {
        let doa = await Doa.findByPk(req.params.id || req.body.doa_id);

        if(!doa){
            return res.status(404).send({
                message: "error",
                error: "Invalid Doa Id."
            });
        }

        next();
    }
    ,
    getAll(req, res) {
        return Doa.findAll({
            include: [],
            order: [['createdAt', 'ASC']]
        }).then(doa => res.status(200).send({
            message: "Success",
            data: doa
        })).catch(err => res.status(400).send(err));
    },

    findById(req, res) {
        Doa.findByPk(req.params.id)
        .then(doa => {
            return res.status(200).send({message: "success", data: doa})
        }).catch(err => res.status(400).send(err));
    },

    async add(req, res) {
        
        const doa = await Doa.create({
            category_id: req.body.category_id,
            title: req.body.title,
            prev: req.body.prev || null,
            next: req.body.next || null
        })

        // console.log(cat.dataValues);

        return res.status(200).send({
            message: "Success",
            data: doa
        })
    },

    async delete(req, res) {
        try{
            await Detail.destroy({
                where: {
                    doa_id: req.params.id
                }
            });
    
            await Doa.destroy({
                where: {
                    id: req.params.id
                }
            });
            return res.status(200).send({message: "Success"});
        }catch(err){
            return res.status(400).send(err);
        }

    },

    async update(req, res) {
        try{
            const doa = await Doa.findByPk(req.params.id);

            doa.set({
                category_id: req.body.category_id || doa.category_id,
                title: req.body.title || doa.title,
                prev: req.body.prev || doa.prev,
                next: req.body.next || doa.next
            });

            await doa.save();

            return res.status(200).send({
                message: "Success",
                data: doa
            })
        }catch(err){
            return res.status(400).send(err);
        }
    },

    async listDetailByDoaId(req, res){
        try{
            const doa = await Doa.findByPk(req.params.id);
            const detail = await Detail.findAll({
                where: {
                    doa_id: req.params.id
                }
            });

            return res.status(200).send({
                message: "Success",
                doa,
                detail
            })
        }catch(err){
            return res.status(400).send(err);
        }


    }
}