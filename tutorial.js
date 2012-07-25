YUI.add('tutorial', function(Y) {
	/*constants*/
	CORRECT_MARK = '<img src="images/checkmark.gif" alt"checkmark"/>';
	INCORRECT_MARK = '<img src="images/xmark.gif" alt="xmark"/>';
	CORRECT_MSG = 'Correct!';
	INCORRECT_MSG = 'Wrong. Try again.';
	
	Y.Navigation = function() {
		this.header = Y.one('#header');
		this.bar = Y.one('#navigation');
		this.navButton = Y.one('#header').one('.mini-nav');    
		this.init();	
	};
	Y.Navigation.prototype = {
		init: function() {
			this.bar.addClass('slide-hide');
			this.navButton.on('click', this.toggleNav, this);
			this.bar.on('click', this.handleClick, this);
		},
		handleClick: function(e) {
			if (e.target.get('tagName') === 'A'){
				var section = e.target.getAttribute('data-title');
				this.toggleNav();
				this.bar.all('a').removeClass('active');
				e.target.addClass('active');
				this.header.one('h1 > span').set('innerHTML', section);
			}
		},
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
		}
	};
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
		handleClick : function(e) {
			if (e.target.get('tagName') === 'IMG') {
				this.reveal(e.target.get('parentNode'));
			}
		},
		handleHover : function(e) {
			if (e.target.get('tagName') === 'IMG') {
				this.reveal(e.target.get('parentNode'));
			}
		},
		reveal : function(el) {
			el.addClass('expand');
			Y.later(1000, this, this.clearHide, el);
		}, 
		clearHide : function(el) {
			el.one('strong').removeClass('hide');
		}
	};
	Y.Pagination = function(){
		this.sections = Y.all('section');
		this.init();
	};
	Y.Pagination.startSection = Y.one('section#intro');
	Y.Pagination.pagination =  Y.one('#pagination');
	Y.Pagination.manageArticles = function(e) {
		var allArticles = Y.Pagination.startSection.all('article'),
			artLength = allArticles.size(), 
			myActive = 0;
			pNext = Y.Pagination.pagination.one('.next'), 
			pBack = Y.Pagination.pagination.one('.back');
			if(e) {
				e.halt();
				myActive = e.target.getAttribute('data-gotopage');
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
				page = parseInt(active.getAttribute('data-page'));
				if (page < artLength - 1) {
					pNext.removeClass('hide');
					pNext.setAttribute('data-gotopage', page+1)
				}
				else {
					pNext.addClass('hide');
					pNext.setAttribute('data-gotopage', artLength - 1);
				}
				if (active.getAttribute('data-page') > 0) {
					pBack.removeClass('hide');
					pBack.setAttribute('data-gotopage', page-1);
				}
				else {
					pBack.addClass('hide');
					pBack.setAttribute('data-gotopage', 0);
				}
			}
	};
	Y.Pagination.prototype = {
		init : function() {
			this.initializeSections();
			Y.Pagination.manageArticles();
			Y.on('hashchange', this.swapSection, Y.config.win);
			Y.Pagination.pagination.on('click', Y.Pagination.manageArticles, this);
		},
		initializeSections : function() {
			this.sections.each(function(node){
				node.addClass('hide');
			});
			Y.Pagination.startSection.removeClass('hide');
		},
		swapSection : function(e) {
			Y.all('section').addClass('hide');
			var selector = '#' + e.newHash,
				myNode = Y.one(selector);
			myNode.removeClass('hide');
			Y.Pagination.startSection = myNode;
			Y.Pagination.manageArticles();
		}
	};
	Y.DropQuiz = function(formNode) {
		this.form = formNode;
		this.init();
	};
	Y.DropQuiz.prototype = {
		init : function() {
			this.form.on("change", this.handleChange, this);
		}, 
		handleChange : function(e) {
			//check the value and if it matches a valid value
			if (this.containsValue(e.target.get('value'),e.target.getAttribute('data-valid').split('|'))) {
				e.target.next('div.scoring').set('innerHTML', CORRECT_MARK + CORRECT_MSG);
			}
			else {
				e.target.next('div.scoring').set('innerHTML', INCORRECT_MARK + INCORRECT_MSG);
			}
		}, 
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
    
}, '0.0.1', { requires: ['node','event','history-hash'] });

YUI().use('tutorial', function(Y) {
    	var tmp = new Y.Navigation();
		var tmp2 = new Y.Revealer();
		var tmp3 = new Y.Pagination();
		var tmp4 = new Y.DropQuiz(Y.one('#evalForm'));
});