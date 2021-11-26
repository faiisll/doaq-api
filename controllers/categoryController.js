const db = require("../models/index");
const Category = require("../models").Category;
const Doa = require("../models").Doa;
const Detail = require("../models").Detail;
const Op = db.Sequelize.Op;

module.exports = {
  getAll(req, res) {
    Category.findAll({
      include: [],
      order: [["createdAt", "ASC"]],
    })
      .then((cat) => {
        if (!cat.length) {
          return res.status(200).send({
            message: "no category record",
            data: cat,
          });
        }

        return res.status(200).send({
          message: "Success get all category.",
          data: cat,
        });
      })
      .catch((err) => res.status(400).send(err));
  },

  findById(req, res) {
    Category.findByPk(req.params.id)
      .then((cat) => {
        if (!cat) {
          return res.status(404).send({
            message: "error",
            error: `Category with id ${req.params.id} not found`,
          });
        }

        return res.status(200).send({
          message: "Success",
          data: cat,
        });
      })
      .catch((err) => res.status(500).send(err));
  },

  add(req, res) {
    Category.create({
      name: req.body.name,
      color: req.body.color,
    })
      .then((cat) => res.status(200).send({message: "Category added"}))
      .catch((err) => res.status(400).send(err));
  },

  update(req, res) {
    Category.findByPk(req.params.id).then((category) => {
      if (!category) {
        return res.status(404).send({
          message: "error",
          error: `Category with id ${req.params.id} not found`,
        });
      }

      return category
        .update({
          name: req.body.name || cat.name,
          color: req.body.color || cat.color,
        })
        .then((cat) =>
          res.status(200).send({message: "Category updated.", data: cat})
        )
        .catch((err) => res.status(400).send(err));
    });
  },

  async delete(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).send({
          message: "error",
          error: "Category not found.",
        });
      }

      Category.destroy({
        where: {
          id: req.params.id
        }
      })

      const doa = await Doa.findAll({
        where : {
          category_id: req.params.id
        }
      });
      
      if(doa.length > 0){
        await Doa.destroy({
          where: {
            category_id: req.params.id,
          },
        });

        for(var i =0; i < doa.length; i++){
          await Detail.destroy({
            where: {
              doa_id: doa[i].id
            }
          })
        }
      }

      return res.status(200).send({
        message: "success"
      });


      //   console.log(category.dataValues);
    } catch (err) {
      return res.status(400).send({
        message: "Error",
        error: err
      });
    }
  },

  async doaListByCategoryId(req, res) {
    try {
      const cat = await Category.findByPk(req.params.id);
      const doa = await Doa.findAll({
          where: {
              category_id: req.params.id
          }
      });
      
      if (!cat) {
        return res.status(404).send({
          message: "error",
          error: "Category not found.",
        });
      }

      return res.status(200).send({
          category: cat,
          doa
      });

    } catch (err) {
        return res.status(400).send();
    }
  },
};
