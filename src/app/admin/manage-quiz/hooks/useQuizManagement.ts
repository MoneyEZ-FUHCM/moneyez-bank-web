import { QUIZ_ASSIGN_STATUS, TOAST_STATUS } from "@/enums/globals";
import { showToast } from "@/hooks/useShowToast";
import {
  useActiveQuestionMutation,
  useCreateQuizMutation,
  useDeleteQuestionsMutation,
  useGetQuizListQuery,
  useUpdateQuizMutation,
} from "@/services/admin/quiz";
import { Quiz } from "@/types/quiz.types";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export const useQuizManagementPage = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [quiz, setQuiz] = useState<Quiz>({
    title: "",
    description: "",
    status: 1,
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    content: "",
    answerOptions: [{ content: "" }, { content: "" }],
  });

  const { data: quizList } = useGetQuizListQuery({
    PageIndex: 1,
    PageSize: 100,
  });

  const [createQuiz] = useCreateQuizMutation();
  const [updateQuizList] = useUpdateQuizMutation();
  const [activeQuestion] = useActiveQuestionMutation();
  const [deleteQuizList] = useDeleteQuestionsMutation();

  useEffect(() => {
    if (editingQuestionIndex !== null && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editingQuestionIndex]);

  const handleQuizChange = (e: any) => {
    const { name, value } = e.target;
    setQuiz((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (e: any) => {
    setCurrentQuestion((prev) => ({ ...prev, content: e.target.value }));
  };

  const handleAnswerChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const newAnswers = currentQuestion.answerOptions.map((option, i) =>
      i === index ? { ...option, content: e.target.value } : option,
    );

    setCurrentQuestion((prev) => ({
      ...prev,
      answerOptions: newAnswers,
    }));
  };

  const addAnswer = () => {
    setCurrentQuestion((prev) => ({
      ...prev,
      answerOptions: [...prev.answerOptions, { content: "" }],
    }));
  };

  const removeAnswer = (index: number) => {
    if (currentQuestion.answerOptions.length <= 2) return;

    const newAnswers = [...currentQuestion.answerOptions];
    newAnswers.splice(index, 1);

    setCurrentQuestion((prev) => ({
      ...prev,
      answerOptions: newAnswers,
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.content.trim()) {
      showToast(TOAST_STATUS.INFO, "Vui lòng nhập nội dung câu hỏi");
      return;
    }

    const allAnswersHaveContent = currentQuestion.answerOptions.every(
      (option) => option.content.trim(),
    );
    if (!allAnswersHaveContent) {
      showToast(
        TOAST_STATUS.INFO,
        "Vui lòng nhập nội dung cho tất cả các đáp án",
      );
      return;
    }

    if (editingQuestionIndex !== null) {
      const updatedQuestions = [...quiz.questions];
      updatedQuestions[editingQuestionIndex] = currentQuestion;

      setQuiz((prev) => ({
        ...prev,
        questions: updatedQuestions,
      }));

      setEditingQuestionIndex(null);
      showToast(TOAST_STATUS.SUCCESS, "Đã cập nhật câu hỏi");
    } else {
      setQuiz((prev) => ({
        ...prev,
        questions: [...prev.questions, currentQuestion],
      }));

      showToast(TOAST_STATUS.SUCCESS, "Đã thêm câu hỏi vào bộ câu hỏi");
    }

    setCurrentQuestion({
      content: "",
      answerOptions: [{ content: "" }, { content: "" }],
    });
  };

  const editQuestion = (index: number) => {
    const questionToEdit = {
      ...quiz.questions[index],
      answerOptions: quiz.questions[index].answerOptions.map((option) => ({
        ...option,
      })),
    };

    setCurrentQuestion(questionToEdit);
    setEditingQuestionIndex(index);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...quiz.questions];
    newQuestions.splice(index, 1);

    setQuiz((prev) => ({
      ...prev,
      questions: newQuestions,
    }));

    if (editingQuestionIndex === index) {
      cancelEditQuestion();
    } else if (editingQuestionIndex !== null && editingQuestionIndex > index) {
      setEditingQuestionIndex(editingQuestionIndex - 1);
    }

    showToast(TOAST_STATUS.SUCCESS, "Đã xóa câu hỏi");
  };

  const cancelEditQuestion = () => {
    setEditingQuestionIndex(null);
    setCurrentQuestion({
      content: "",
      answerOptions: [{ content: "" }, { content: "" }],
    });
  };

  const createNewQuiz = () => {
    setSelectedQuiz(null);
    setIsEditing(false);
    setQuiz({
      title: "",
      description: "",
      status: 0,
      questions: [],
    });
    cancelEditQuestion();
  };

  const updateQuiz = async () => {
    if (!quiz.title.trim()) {
      showToast(TOAST_STATUS.INFO, "Vui lòng nhập tiêu đề bộ câu hỏi");
      return;
    }

    if (quiz.questions.length === 0) {
      showToast(TOAST_STATUS.INFO, "Bộ câu hỏi cần có ít nhất một câu hỏi");
      return;
    }

    const { status, ...rest } = quiz;
    const newQuiz = {
      ...rest,
      id: selectedQuiz,
    };

    try {
      await updateQuizList(newQuiz).unwrap();
      showToast(TOAST_STATUS.SUCCESS, "Đã cập nhật bộ câu hỏi thành công");
    } catch (error) {
      showToast(TOAST_STATUS.ERROR, "Đã cập nhật bộ câu hỏi thất bại");
    }
  };

  const toggleActive = async (quizId: string) => {
    if (quizId !== selectedQuiz) {
      showToast(TOAST_STATUS.INFO, "Vui lòng chọn bộ câu hỏi trước khi active");
      return;
    }

    const targetQuiz = quizList?.items?.find((q: any) => q.id === quizId) as
      | Quiz
      | undefined;
    if (targetQuiz?.status === QUIZ_ASSIGN_STATUS.ACTIVE) {
      showToast(TOAST_STATUS.INFO, "Bộ câu hỏi này đã được active");
      return;
    }

    try {
      await activeQuestion(quizId).unwrap();
      showToast(TOAST_STATUS.SUCCESS, "Đã active bộ câu hỏi thành công");
    } catch (error) {
      showToast(TOAST_STATUS.ERROR, "Đã lưu bộ câu hỏi thất bại");
    }
  };

  const saveQuiz = async () => {
    if (!quiz.title.trim()) {
      showToast(TOAST_STATUS.INFO, "Vui lòng nhập tiêu đề bộ câu hỏi");
      return;
    }

    if (quiz.questions.length === 0) {
      showToast(TOAST_STATUS.INFO, "Bộ câu hỏi cần có ít nhất một câu hỏi");
      return;
    }

    try {
      await createQuiz(quiz).unwrap();
      showToast(TOAST_STATUS.SUCCESS, "Tạo bộ câu hỏi thành công");
      createNewQuiz();
    } catch (error) {
      showToast(TOAST_STATUS.ERROR, "Lưu bộ câu hỏi thất bại");
    }
  };

  const selectQuiz = (id: string) => {
    const found = quizList?.items?.find((q: any) => q.id === id) as
      | Quiz
      | undefined;

    if (found) {
      setSelectedQuiz(id);
      setIsEditing(true);
      setQuiz({
        title: found.title || "",
        description: found.description,
        status: found.status,
        questions: found.questions,
      });
      cancelEditQuestion();
    }
  };

  const handleDeleteQuiz = async (id: string, e: any) => {
    try {
      await deleteQuizList(id).unwrap();
      showToast(TOAST_STATUS.SUCCESS, `Xóa bộ câu hỏi với ID: ${id}`);

      if (selectedQuiz === id) {
        createNewQuiz();
      }
    } catch (error) {
      showToast(TOAST_STATUS.ERROR, "Xóa bộ câu hỏi thất bại");
    }
  };

  return {
    state: {
      quizList,
      selectedQuiz,
      isEditing,
      editingQuestionIndex,
      quiz,
      currentQuestion,
      cardRef,
    },
    handler: {
      handleQuizChange,
      handleQuestionChange,
      handleAnswerChange,
      addAnswer,
      removeAnswer,
      addQuestion,
      editQuestion,
      removeQuestion,
      cancelEditQuestion,
      createNewQuiz,
      updateQuiz,
      toggleActive,
      saveQuiz,
      selectQuiz,
      handleDeleteQuiz,
    },
  };
};
