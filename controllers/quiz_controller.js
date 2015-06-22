var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz){
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId=' + quizId));}
		}
	).catch(function(error){ next(error);});
};

// GET /quizes
exports.index = function(req, res) {
	// definimos un objeto vacio en caso de que el usuario no haga
	// una busqueda y queramos mostrar todos los resultados
	var query = {};

	// si el usuario realiza una busqueda, componemos el query
   if(req.query.search) {
   	
   		var search = req.query.search;
        search = search.split(" ").join('%');
        search = '%' + search + '%';

        query = {
            where: ["lower(pregunta) like lower(?)", search], order: 'pregunta ASC'
        };
    }
	models.Quiz.findAll(query).then(
		function(quizes){
			res.render('quizes/index.ejs', { quizes: quizes});
		}
	).catch(function(error){ 
		next(error);
	});
};
// GET /quizes/:id
exports.show = function(req, res){
	res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
		if(req.query.respuesta === req.quiz.respuesta){
			resultado = 'Correcto';
		}
		res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});	
};

//Mirar https://www.miriadax.net/web/javascript-node-js/foro/-/message_boards/view_message/34693751
//Y esto para ordenar https://www.miriadax.net/web/javascript-node-js/foro/-/message_boards/view_message/34458509