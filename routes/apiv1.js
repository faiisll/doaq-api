var express = require('express');
var router = express.Router();
var signController = require('../controllers').signController;
var feedbackController = require('../controllers').feedbackController;
var categoryController = require('../controllers').categoryController;
var doaController = require('../controllers').doaController;
var detailController = require('../controllers').detailController;

/* Auth. */
router.post('/register', signController.signUp);
router.post('/login', signController.signIn);

//Feedback
router.get('/feed', [signController.verifyJwt], feedbackController.getAll);
router.post('/feed', feedbackController.add);
router.delete('/feed/:id', [signController.verifyJwt], feedbackController.delete);

//Category
router.get('/category', categoryController.getAll);
router.get('/category/:id', categoryController.findById);
router.get('/category/:id/doa', categoryController.doaListByCategoryId);
router.post('/category', [signController.verifyJwt], categoryController.add);
router.put('/category/:id', [signController.verifyJwt], categoryController.update);
router.delete('/category/:id', [signController.verifyJwt], categoryController.delete);

//Doa
router.get('/doa', doaController.getAll);
router.get('/doa/:id', [doaController.verifyDoa], doaController.findById);
router.get('/doa/:id/detail',[doaController.verifyDoa], doaController.listDetailByDoaId);
router.post('/doa', [doaController.verifyCategory] ,doaController.add);
router.delete('/doa/:id', [doaController.verifyDoa], doaController.delete);
router.put('/doa/:id', [doaController.verifyDoa, doaController.verifyCategory], doaController.update);

//Detail
router.get('/detail', detailController.getAll);
router.get('/detail/:id', [detailController.verifyDetail], detailController.getById);
router.post('/detail', [detailController.verifyDoaId], detailController.add);
router.put('/detail/:id', [detailController.verifyDetail, detailController.verifyDoaId], detailController.update);
router.delete('/detail/:id', [detailController.verifyDetail], detailController.delete);



module.exports = router;
