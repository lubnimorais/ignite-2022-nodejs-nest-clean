import { ValueObject } from '@/core/entities/value-object';

export interface CommentWithAuthProps {
  commentId: string;
  content: string;
  authorId: string;
  author: string;
  createdAt: Date;
  updateAt?: Date | null;
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthProps> {
  get commentId() {
    return this.props.commentId;
  }

  get content() {
    return this.props.content;
  }

  get authorId() {
    return this.props.authorId;
  }

  get author() {
    return this.props.author;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updateAt;
  }

  static create(props: CommentWithAuthProps) {
    return new CommentWithAuthor(props);
  }
}
