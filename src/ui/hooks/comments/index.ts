import * as comments from "./comments";
import useAddComment from "./useAddComment";
import useAddCommentReply from "./useAddCommentReply";
import useDeleteComment from "./useDeleteComment";
import useDeleteCommentReply from "./useDeleteCommentReply";

export default {
  ...comments,
  useAddComment,
  useAddCommentReply,
  useDeleteComment,
  useDeleteCommentReply,
};
