define([
  'sandbox',
  'widgets/commentable/views/comment',
  'widgets/commentable/models/comment'
],

  function (sandbox, CommentView, CommentModel) {


    var CommentableView = sandbox.mvc.View({

      initialize: function(options) {
        this.$el = options.$el;

        this.commentable_id = options.commentable_id;
        this.commentable_type = options.commentable_type;
        this.votableBuilder = options.votableBuilder;

      },

      ////// PUBLIC

      loadComments: function() {
        var that = this;

        sandbox.ajax.request('/comments', {commentable_type: this.commentable_type, commentable_id: this.commentable_id})
          .done(function(comments) {
            comments.each(function(comment) {
              that._jsonCommentToView(comment);
            });
          });
      },

      renderAddComment: function() {
        var that = this,
          $comment = sandbox.dom.$('<div></div>');

        if (sandbox.session.loggedIn()) {
          sandbox.template.render('commentable/templates/add-comment', {}, function (o) {
            $comment.html(o);
            $comment.addClass('add-comment');

            that._hAddEvents($comment);
          });
        } else {
          $comment.html('Login or Register to add and reply to comments');
        }

        return $comment;
      },

      addComment: function() {
        this.$el.append(this.renderAddComment());
      },

      addToCommentable: function(commentable) {
        this.collection.add(commentable);
      },


      /////////// EVENT Handlers

      /////////// PRIVATES //////////////

      _jsonCommentToView: function(comment, options) {
        var view;

        options = options || {};

        view = new CommentView({
          comment: comment,
          votableBuilder: this.votableBuilder
        });

        if (options.animate) {
          this.$el.append(view.render().$el.addClass('animated fadeInDown'));
        } else {
          this.$el.append(view.render().$el);
        }
      },

      _hAddEvents: function($el) {
        var that = this;

        $el.find('button.save').click(function() {
          that._saveComment();
        });
      },

      _saveComment: function() {
        var that = this,
          body = this.$el.find('.add-comment textarea').val();

        CommentModel.addNewCommentFromView(this, body)
          .done(function(comment) {
            that._jsonCommentToView(comment, {animate: true});
          });

        this.$el.find('.add-comment textarea').val('');
      }
    });


    return CommentableView;

  });