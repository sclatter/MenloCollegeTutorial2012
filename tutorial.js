YUI.add('tutorial', function(Y) {
	/*constants*/
	CORRECT_MARK = '<span class="checkmark">&#x2714;</span>';
	INCORRECT_MARK = '<span class="xmark">&#x2718;</span>';
	CORRECT_MSG = 'Correct!';
	INCORRECT_MSG = 'Try Again.';
	
	/**
	@class Navigation
	@constructor
	Runs the navigation interaction
	*/
	Y.Navigation = function() {
		this.header = Y.one('#header');
		this.bar = Y.one('#navigation');
		this.navPs = Y.all('p.navigation');
		this.navButton = Y.one('#header').one('.mini-nav');    
		this.init();	
	};
	Y.Navigation.prototype = {
		init: function() {
			this.bar.addClass('slide-hide');
			this.navButton.on('click', this.toggleNav, this);
			this.bar.on('click', this.handleClick, this);
			this.navPs.on('click', this.handleClick, this);
			/*if we've got iOS, force the videos to the small, non-flash version*/
			if (Y.UA.ios) {
				this.adjustVideos();
			}
		},
		/**
		@method handleClick handles
		clicks on the navigation bar
		@param e is the event object
		*/
		handleClick: function(e) {
			if (e.target.get('tagName') === 'A'){
				var section = e.target.getData('title');
				var highlightIndex = e.target.getData('hindex');
				var anchorEls = this.bar.all('a');
				this.toggleNav();
				anchorEls.removeClass('active');
				if (highlightIndex) {
					anchorEls.item(highlightIndex).addClass('active');
				}
				else {
					e.target.addClass('active');
				}
				this.header.one('h1 > span').set('innerHTML', section);
			}
		},
		/**
		@method toggleNav shows and 
		hides the tray navigation 
		on mobile devices
		@param e is the event object
		*/
		toggleNav: function(e) {
			if(e) {
				e.halt();
			}
			if (this.bar.hasClass('slide-hide')) {
				this.bar.removeClass('slide-hide');
			}
			else {
				this.bar.addClass('slide-hide');
			}
		}, 
		/**
		@method adjust videos
		toggles videos for iOS
		to make them navigable
		for non-Flash
		*/
		adjustVideos: function(){
			Y.all('p.video-large').setStyle('display', 'none');
			Y.all('p.video-small').setStyle('display', 'block');
		}
	};
	/**
	@class Revealer handles
	@constructor
	Handles the interaction for
	all the colorful revealing
	lists in the tutorial
	*/
	Y.Revealer = function() {
		this.nodes = Y.all('ol.reveal');
		this.init();
	};
	Y.Revealer.prototype = {
		init : function() {
			Y.all('ol.reveal li strong').addClass('hide');
			this.nodes.on('click', this.handleClick, this);
			this.nodes.on('mouseover', this.handleHover, this);
		},
		/**
		@method handleClick handles
		clicks on images for non-hoverable
		browsers
		@param e is the event object
		*/
		handleClick : function(e) {
			if (e.target.get('tagName') === 'IMG') {
				this.reveal(e.target.get('parentNode'));
			}
		},
		/**
		@method handleHover handles
		hovers on each image
		@param e is the event object
		*/
		handleHover : function(e) {
			if (e.target.get('tagName') === 'IMG') {
				this.reveal(e.target.get('parentNode'));
			}
		},
		/**
		@method reveal handles
		changing the classname with delay
		@param el is the element 
		being transformed.
		*/
		reveal : function(el) {
			el.addClass('expand');
			Y.later(1000, this, this.clearHide, el);
		}, 
		/**
		@method clearHide handles
		revealing the text on the list
		item
		@param el is the element being 
		transformed
		*/
		clearHide : function(el) {
			el.one('strong').removeClass('hide');
		}
	};
	
	/**
	@class ShowMe
	@constructor
	does the hover/reveal
	interaction on the 
	truncation search list
	and any similar interactions
	desired
	*/
	Y.ShowMe = function() {
		this.lists = Y.all('ul.more-info');
		this.triggers = Y.all('ul.more-info a.trigger');
		this.init();
	};
	Y.ShowMe.prototype = {
		init: function() {
			this.triggers.on('click', this.revealNext, this);
			this.lists.on('mouseenter', this.hideTrigger, this);
		}, 
		/**
		@method revealNext shows
		the obscured sub-list
		@param e is the event object
		*/
		revealNext: function(e) {
			e.preventDefault();
			e.target.ancestor('ul').one('ol').removeClass('hiding');
		}, 
		/**
		@method hideTrigger hides the 
		trigger anchor when the interaction
		has been revealed
		@param e is the event object
		*/
		hideTrigger: function(e) {
			e.target.all('a.trigger').addClass('hide');
		}
	};
	
	/**
	@class Pagination 
	@constructor
	Handles the on the fly
	pagination of article tags
	and page changes via the 
	subnav on desktop browsers
	*/
	Y.Pagination = function(){
		this.sections = Y.all('section');
		this.init();
	};
	/**
	static properties and methods 
	needed for hashchange event, which
	cannot bind to reference object
	*/
	Y.Pagination.startSection = Y.one('section#intro');
	Y.Pagination.pagination =  Y.one('#pagination');
	Y.Pagination.subnav = Y.one('div#subnav');
	/**
	@method manageArticles sets
	up pagination of articles
	when a section is selected in the main
	navigation, triggering a hashchange 
	event
	@param e is the event object
	*/
	Y.Pagination.manageArticles = function(e) {
		//if coming from a click event, make sure target was anchor
		if(e && e.target.get('tagName') !== 'A') {	
			return false;
		}
		//scroll to top
		window.scrollTo(0,0);
		var allArticles = Y.Pagination.startSection.all('article'),
			artLength = allArticles.size(), 
			myActive = 0, 
			sectionId = Y.Pagination.startSection.get('id');

			//activate subnav & turn on subnav for the section
			Y.Pagination.subnav.removeClass('hide');
			//hide all ULs, and turn only the appropriate one one
			Y.Pagination.subnav.all('ul').addClass('hide');
			Y.Pagination.subnav.all('ul#sub' + sectionId).removeClass('hide');
			
			pNext = Y.Pagination.pagination.one('.next'), 
			pBack = Y.Pagination.pagination.one('.back');
			if(e && e.target.get('tagName') === 'A') {
				e.halt();
				myActive = e.target.getData('gotopage');
			}
			/*if there is more than one article, hide subsequent 
			and set up pagination*/
			if (artLength > 1) {
				Y.Pagination.pagination.removeClass('hide');
				for (i = 0; i < artLength; i++) {
					allArticles.item(i).addClass('page-hide');
					allArticles.item(i).removeClass('active');
					allArticles.item(myActive).removeClass('page-hide');
					allArticles.item(myActive).addClass('active');
					allArticles.item(i).setAttribute('data-page', i);
				}
				var active = Y.Pagination.startSection.one('.active'), 
				page = parseInt(active.getData('page'));
				if (page < artLength - 1) {
					pNext.removeClass('hide');
					pNext.setAttribute('data-gotopage', page+1)
				}
				else {
					pNext.addClass('hide');
					pNext.setAttribute('data-gotopage', artLength - 1);
				}
				if (active.getData('page') > 0) {
					pBack.removeClass('hide');
					pBack.setAttribute('data-gotopage', page-1);
				}
				else {
					pBack.addClass('hide');
					pBack.setAttribute('data-gotopage', 0);
				}
			}
	};
	/**
	instance methods for Pagination
	*/
	Y.Pagination.prototype = {
		init : function() {
			this.initializeSections();
			Y.Pagination.manageArticles();
			Y.on('hashchange', this.swapSection, Y.config.win);
			Y.Pagination.pagination.on('click', Y.Pagination.manageArticles, this);
			Y.Pagination.subnav.on('click', Y.Pagination.manageArticles, this);
		},
		/**
		@method initializeSections hides
		all but the current section we are in
		*/
		initializeSections : function() {
			this.sections.each(function(node){
				node.addClass('hide');
			});
			Y.Pagination.startSection.removeClass('hide');
		},
		/**
		@method swapSection changes current
		section on hashchange event 
		@param e is the event object
		*/
		swapSection : function(e) {
			Y.all('section').addClass('hide');
			var selector = '#' + e.newHash,
				myNode = Y.one(selector);
			myNode.removeClass('hide');
			Y.Pagination.startSection = myNode;
			Y.Pagination.manageArticles();
		}
	};
	/**
	@class DropQuiz
	@constructor
	handles the interactive 
	dropdown exercises in the 
	tutorial
	@param formNode is the form
	we are attaching interaction 
	to
	*/
	Y.DropQuiz = function(formNode) {
		this.form = formNode;
		this.init();
	};
	Y.DropQuiz.prototype = {
		init : function() {
		//if we're not IE <= 8, we can delegate this event
			if (Y.UA.ie > 0 && (Y.UA.ie < 9)) {
				this.form.all('select').on("change", this.handleChange, this);
			} 
			else {
				this.form.on("change", this.handleChange, this);
			}
		}, 
		/**
		@method handleChange
		handles the change on any select form
		control and gives feedback on correctness
		@param e is the event object
		*/
		handleChange : function(e) {
			//check the value and if it matches a valid value
			if (this.containsValue(e.target.get('value'),e.target.getData('valid').split('|'))) {
				e.target.next('div.scoring').set('innerHTML', CORRECT_MARK + CORRECT_MSG);
			}
			else {
				e.target.next('div.scoring').set('innerHTML', INCORRECT_MARK + INCORRECT_MSG);
			}
		}, 
		/**
		@method containsValue checks
		to see if the answer selected
		is contained in the set of 
		correct answers, supporting multiple corrects
		@param needle is the answer to find
		@param haystack is the list of possible answers
		*/
		containsValue : function(needle, haystack) {
			var l = haystack.length;
			for (var i = 0; i < l; i++) {
				if(haystack[i] === needle) {
					return true;
				}
			}
			return false;
		}
	};
	/**
	@class TableToggle
	@constructor
	handles the interactions
	for tables containing
	comparisons of scholarly vs. popular
	sources and different types of Boolean
	searches
	@param tableController
	is the list element used to select
	options for display in the table
	*/
	Y.TableToggle = function(tableController) {
		this.controller = tableController.one('ul.table-driver');
		this.table = tableController.one('table');
		this.init();
	};
	Y.TableToggle.prototype = {
		init : function(){
			this.controller.on('click', this.handleClick, this);
		}, 
		/**
		@method handleClick
		handles clicks on the controller
		list
		@param e is the event object
		*/
		handleClick : function(e) {
			e.preventDefault();
			if (e.target.get('tagName') === 'A') {
				this.table.removeClass('ghost');
				this.hideAllRows();
				this.showRow(e.target.getData('item'));
			}
			else {
				return;
			}
		},
		/**
		@method hideAllRows
		hides all the rows in the table from
		view for visual users only
		*/
		hideAllRows : function(){
			this.table.all('tr.inner-row').addClass('ghost');
			this.table.all('img').addClass('hide');
		}, 
		/**
		@method showRow
		reveals the appropriate table
		row for visual users only
		@param rowItem is the row 
		to show
		*/
		showRow : function(rowItem){
			this.table.all('tr.inner-row').item(rowItem).removeClass('ghost');
			this.table.all('img').removeClass('hide');
		}
	};
	/**
	@class SectionQuiz
	@constructor
	handles the interaction
	for all Section knowledge
	quizzes
	@param form is the form 
	we are attaching the 
	interaction to
	*/
	Y.SectionQuiz = function(form) {
		this.form = form;
		this.submitBtn = this.form.one('input[type=submit]');
		this.resetBtn = this.form.one('input[type=reset]');
		this.numCorrect = 0;
		this.numRequired = this.form.getData('required');
		this.formName = this.form.getData('name');
		this.email = this.form.one('input[type=email]');
		this.name = this.form.one('input[type=text]');
		this.questionEls = this.form.all('ul');
		this.init();
	};
	Y.SectionQuiz.prototype = {
		init: function() {
			this.submitBtn.on('click', this.validateForm, this);
			this.resetBtn.on('click', this.reset, this);
		}, 
		/**
		@method reset
		resets the form when
		reset button is clicked
		@param e is the event object
		*/
		reset: function(e) {
			//hide all hints/prompts
			this.form.all('span.error').addClass('hide');
			this.form.all('span.correct').addClass('hide');
			this.form.one('p.congrats').addClass('hide');
			this.form.one('p.sorry').addClass('hide');
			//reset submit button
			this.submitBtn.set('disabled', false);
		},
		/**
		@method validateForm
		validates that all 
		questions are attempted
		and that name and email are
		provided
		@param e is the event object
		*/
		validateForm: function(e) {
			var emailValid = this.emailIsValid(),
			nameValid = this.nameIsValid(), 
			allAnswered = this.allQuestionsAnswered();
			e.halt();
			if (emailValid && nameValid && allAnswered) {
				this.gradeQuiz();
			}
			else {
				if (!emailValid) {
					alert("Please enter a valid email address for credit.");
				}
				if (!nameValid) {
					alert("Please enter your name for credit.");
				}
				if (!allAnswered) {
					alert("Please answer all questions before submitting.");
				}
			}
		}, 
		/**
		@method emailIsValid
		checks that email is not empty and contains
		@ and . characters. 
		@return boolean
		*/
		emailIsValid: function() {
			 return (this.email.get('value') !== '' && 
			 this.email.get('value').indexOf('.') !== -1 && 
			 this.email.get('value').indexOf('@') !== -1);
		}, 
		/**
		@method nameIsValid
		checks that name field is not empty
		@return boolean
		*/
		nameIsValid: function(){
			return (this.email.get('value') !== '');
		}, 
		/**
		@method allQuestionsAnswered
		checks that all questions 
		have at least one box checked
		@return boolean
		*/
		allQuestionsAnswered: function(){
			var numQuestions = this.questionEls.size(), 
			questionsAnswered = [];
			for (i=0; i < numQuestions; i++) {
				var boxes = this.questionEls.item(i).all('input[type=checkbox]:checked').size();
				if (boxes > 0) {
					questionsAnswered.push(boxes);
				}
			}
			return (questionsAnswered.length === numQuestions);	
		}, 
		/**
		@method gradeQuiz
		determines whether questions are
		right or wrong and tallies 
		the number correct for pass or fail
		It also gives the feedback 
		to the user about each item selected
		*/
		gradeQuiz: function() {
			var results = {
				correct: [],
				incorrect: [], 
				list: [], 
				pass: false
			};
			//push base details into results
			results.list.push(this.form.getData('name'));
			results.list.push(this.name.get('value'));
			results.list.push(this.email.get('value'));
			this.questionEls.each(function(el){
				var checkBoxes = el.all('input[type=checkbox]'), 
				questionIsCorrect = true, 
				correctPrompt = el.previous('span.correct'), 
				numTrue = 1;
				 
				for (i=0, x=checkBoxes.size(); i<x; i++) {
					
					/*go through the checked boxes first*/
					if (checkBoxes.item(i).get('checked')) {
						//incorrect item checked, point it out and mark question wrong
						if (checkBoxes.item(i).getData('c') === "false") {
							if (checkBoxes.item(i).next('span.error')) {
								checkBoxes.item(i).next('span.error').removeClass('hide');
							}
							questionIsCorrect = false;
						}
					}
					/*then go through the unchecked boxes*/
					else {
						//they missed one that should have been checked, mark question wrong
						if (checkBoxes.item(i).getData('c') === "true") {
							questionIsCorrect = false;
						}
					}
					/*count number of true boxes for multiple answer*/
					if (checkBoxes.item(i).getData('c') === "true") {
						numTrue++;
					}
				}
				/*iterate through correctly checked on incomplete multiple answer and reveal hint*/
				if (numTrue > 1) {
					for (i=0, x=checkBoxes.size(); i<x; i++) {
						if (checkBoxes.item(i).get('checked') && 
						checkBoxes.item(i).getData('c') === "true" &&
						!questionIsCorrect) {
							if (checkBoxes.item(i).next('span.error')) {
								checkBoxes.item(i).next('span.error').removeClass('hide');
							}
						}
					}
				}
				
				//if question is correct, display congrats, increment numCorrect
				if (questionIsCorrect) {
					correctPrompt.removeClass('hide');
					results.correct.push(el.one('input').get('name'));
					results.list.push(1);
				}
				else {	
					results.incorrect.push(el.one('input').get('name'));
					results.list.push(0);
				}
				return results;
				
			}, results);
			this.numCorrect = results.correct.length;
			if (this.numCorrect >= this.numRequired) {
				this.form.one('p.congrats').removeClass('hide');
				results.pass = true;
			}
			else {
				this.form.one('p.sorry').removeClass('hide');
				this.submitBtn.set('disabled', true);
			}
			//post results
			this.postResults(results.list, results.pass);
		}, 
		/**
		@method postResults sends
		the results of the quiz 
		to a back end script for storage/processing
		@param list is the list containing 
		student information and result of each
		question
		@param pass is a Boolean representing
		whether it was a pass or fail
		*/
		postResults : function(list, pass) {
		    var list = list;
		    var pass = pass;
		    var name = list[1];
		    var email = list[2];
		    var quiz = list[0];
		    var handleSuccess = function(){console.log('Results posted successfully.');};
		    var handleFailure = function(){console.log('Failed to post results.');};
		    var uri = 'quiz.php';
		    var conf =  {
			method: 'POST',
			data: 'list=' + list + '&pass=' + pass + '&email=' + email + '&quiz=' + quiz + '&name=' + name,
			headers: { 'X-Transaction': 'Quiz Results'}, 
			on: {
        		    success: handleSuccess,
        		    failure: handleFailure    				
			    }
			};
		    Y.io(uri, conf);	
		}
	};
	
	//lazy load images and videos
	Y.all('div.article-image img').removeClass('hide');
	Y.all('img.feature').removeClass('hide');
	Y.all('div.video').removeClass('hide');
    
}, '0.0.1', { requires: ['node','event','history-hash', 'selector-css3', 'io-base'] });

/*use the tutorial module and instantiate all objects from the classes*/
YUI().use('tutorial', function(Y) {
    	var tmp = new Y.Navigation();
		var tmp2 = new Y.Revealer();
		var tmp3 = new Y.Pagination();
		var tmp4 = Y.all('form.exercise');
		tmp4.each(function(form){
			var els = new Y.DropQuiz(form);
		});
		var tmp5 = Y.all('div.table-driver');
		tmp5.each(function(el){
			var els = new Y.TableToggle(el);
		});
		var tmp6 = Y.all('form.quiz');
		tmp6.each(function(form){
			var els = new Y.SectionQuiz(form);
		});
		var tmp7 = new Y.ShowMe();
		//clear loading state
		Y.one('#tutorial-loading').addClass('hide');
});