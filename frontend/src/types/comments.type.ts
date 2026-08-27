export type ReactionActionType = 'like' | 'dislike' | 'violate';

export type CommentReactionType = {
  comment: string;
  action: ReactionActionType;
};
