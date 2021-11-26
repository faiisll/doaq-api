const db = require("../models/index");
const Category = require("../models").Category;
const Doa = require("../models").Doa;
const Detail = require("../models").Detail;
const Op = db.Sequelize.Op;

module.exports = {
  async verifyDetail(req, res, next) {
    try {
      const detail = await Detail.findByPk(req.params.id);

      if (!detail) {
        return res.status(404).send({
          message: "Error",
          error: "Detail Not Found",
        });
      }
      next();
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async verifyDoaId(req, res, next) {
    try {
      const doa = await Doa.findByPk(req.body.doa_id);

      if (!doa) {
        return res.status(404).send({
          message: "Error",
          error: "Doa Not Found",
        });
      }

      next();
    } catch (err) {
      return res.status(400).send(err);
    }
  },
  async getAll(req, res) {
    try {
      const detail = await Detail.findAll({
        include: [],
        order: [["id", "ASC"]],
      });

      return res.status(200).send({
        message: "Success",
        data: detail,
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async getById(req, res) {
    try {
      const detail = await Detail.findByPk(req.params.id);

      return res.status(200).send({
        message: "Success",
        data: detail,
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async add(req, res) {
    try {
      const detail = await Detail.create({
        doa_id: req.body.doa_id,
        desc: req.body.desc || "",
        arabic: req.body.arabic || "",
        latin: req.body.latin || "",
        translate: req.body.translate || "",
      });

      return res.status(200).send({
        message: "Success",
        data: detail,
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async update(req, res) {
    try {
      const detail = await findByPk(req.params.id);

      detail.set({
        doa_id: req.body.doa_id || detail.doa_id,
        desc: req.body.desc || detail.desc,
        arabic: req.body.arabic || detail.arabic,
        latin: req.body.latin || detail.latin,
        translate: req.body.translate || detail.translate,
      });

      await detail.save();

      return res.status(200).send({
        message: "Success",
        data: detail
    })
    } catch (err) {
        return res.status(400).send(err);
    }
  },

  async delete(req, res){
      try{
          await Detail.destroy({
              where: {
                  id: req.params.id
              }
          });

          return res.status(200).send({message: "Success"});
      }catch(err){
        return res.status(400).send(err);
      }
  }
};
