"use client";

import { ButtonCustom } from "@/components/ui/button";
import { InputCustom } from "@/components/ui/input";
import { TextareaCustom } from "@/components/ui/textarea";
import { QUIZ_ASSIGN_STATUS } from "@/enums/globals";
import { formatDate } from "@/utils";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Badge, Button, Divider, Popconfirm } from "antd";
import { useQuizManagementPage } from "../hooks/useQuizManagement";
import { BadgeQuestionCustom } from "./BadgetQuestionCustom";
import { CardQuestion } from "./CardQuestion";

const QuizCreator = () => {
  const { state, handler } = useQuizManagementPage();
  return (
    <div className="flex h-full">
      <div className="h-[82vh] w-2/5 overflow-hidden border-r border-[#E1EACD] bg-white shadow-sm">
        <div className="flex h-full flex-col">
          <div className="sticky top-0 z-10 mb-6 flex items-center justify-between bg-white p-4 pb-4">
            <h2 className="text-xl font-bold text-primary">
              Danh sách bộ câu hỏi
            </h2>
            <div className="flex space-x-3">
              <ButtonCustom
                onClick={handler.createNewQuiz}
                className="flex h-10 items-center gap-x-2 rounded-lg bg-primary px-4 text-white shadow-sm transition-all hover:bg-[#4d766d]"
              >
                <PlusCircleOutlined className="text-lg" />
                <span className="font-medium">Tạo mới</span>
              </ButtonCustom>

              <ButtonCustom
                onClick={() =>
                  state.selectedQuiz && handler.toggleActive(state.selectedQuiz)
                }
                className={`flex h-10 items-center gap-x-2 rounded-lg border px-4 shadow-sm transition-all ${
                  state.selectedQuiz
                    ? "border-primary bg-transparent text-primary hover:bg-[#E1EACD]"
                    : "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
                }`}
                disabled={!state.selectedQuiz}
              >
                <CheckCircleOutlined
                  className={
                    state.selectedQuiz
                      ? "text-lg text-primary"
                      : "text-lg text-gray-400"
                  }
                />
                <span className="font-medium">Áp dụng</span>
              </ButtonCustom>
            </div>
          </div>
          <div className="scrollbar-thin flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-4">
              {state.quizList &&
                state.quizList?.items?.length > 0 &&
                state.quizList?.items?.map((q: any) =>
                  q?.status === QUIZ_ASSIGN_STATUS.ACTIVE ? (
                    <Badge.Ribbon key={q.id} text="Đã áp dụng" color="#609084">
                      <div
                        className={`group relative cursor-pointer rounded-xl border p-5 transition-all hover:border-[#BAD8B6] hover:bg-thirdly/20 ${
                          state.selectedQuiz === q.id
                            ? "border-secondary bg-thirdly/20 ring-1 ring-[#BAD8B6]"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <Popconfirm
                          title="Xóa bộ câu hỏi"
                          description="Bạn có chắc chắn muốn xóa bộ câu hỏi này?"
                          onConfirm={(e) => handler.handleDeleteQuiz(q.id, e)}
                          okText="Xóa"
                          cancelText="Hủy"
                          placement="topRight"
                        >
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            className="absolute right-2 top-1/3 z-10 flex h-8 w-8 items-center justify-center !border-none !bg-white/80 !p-1 opacity-0 !shadow-none transition-opacity hover:!bg-red/10 group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Popconfirm>
                        <div onClick={() => handler.selectQuiz(q.id)}>
                          <div className="mb-3 flex items-center justify-between">
                            <h3
                              className={`text-lg font-medium ${state.selectedQuiz === q.id ? "text-primary" : "text-gray-800"}`}
                            >
                              {q?.title}
                            </h3>
                          </div>
                          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                            {q?.description}
                          </p>
                          <div className="mt-4 flex items-center justify-between border-t border-[#EBEFD6] pt-3">
                            <div className="flex flex-col space-y-1">
                              <p className="flex items-center text-xs font-medium text-gray-500">
                                <CalendarOutlined className="mr-2 text-primary/70" />
                                <span className="mr-1 text-gray-600">Tạo:</span>{" "}
                                {formatDate(q?.createdDate)}
                              </p>
                              <p className="flex items-center text-xs font-medium text-gray-500">
                                <ClockCircleOutlined className="mr-2 text-primary/70" />
                                <span className="mr-1 text-gray-600">
                                  Cập nhật:
                                </span>{" "}
                                {formatDate(q?.updatedDate || q?.createdDate)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 rounded-full bg-secondary/30 px-3 py-1 text-xs font-medium text-primary">
                              <SolutionOutlined />
                              {q?.questions?.length} câu hỏi
                            </div>
                          </div>
                        </div>
                      </div>
                    </Badge.Ribbon>
                  ) : (
                    <div
                      key={q.id}
                      className={`group relative cursor-pointer rounded-xl border p-5 transition-all hover:border-[#BAD8B6] hover:bg-thirdly/20 ${
                        state.selectedQuiz === q.id
                          ? "border-secondary bg-thirdly/20 ring-1 ring-[#BAD8B6]"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <Popconfirm
                        title="Xóa bộ câu hỏi"
                        description="Bạn có chắc chắn muốn xóa bộ câu hỏi này?"
                        onConfirm={(e) => handler.handleDeleteQuiz(q.id, e)}
                        okText="Xóa"
                        cancelText="Hủy"
                        placement="topRight"
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center !border-none !bg-white/80 !p-1 opacity-0 !shadow-none transition-opacity hover:!bg-red/10 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Popconfirm>
                      <div onClick={() => handler.selectQuiz(q.id)}>
                        <div className="mb-3 flex items-center justify-between">
                          <h3
                            className={`text-lg font-medium ${state.selectedQuiz === q.id ? "text-primary" : "text-gray-800"}`}
                          >
                            {q?.title}
                          </h3>
                        </div>

                        <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                          {q?.description}
                        </p>

                        <div className="mt-4 flex items-center justify-between border-t border-[#EBEFD6] pt-3">
                          <div className="flex flex-col space-y-1">
                            <p className="flex items-center text-xs font-medium text-gray-500">
                              <CalendarOutlined className="mr-2 text-primary/70" />
                              <span className="mr-1 text-gray-600">Tạo:</span>{" "}
                              {formatDate(q?.createdDate)}
                            </p>
                            <p className="flex items-center text-xs font-medium text-gray-500">
                              <ClockCircleOutlined className="mr-2 text-primary/70" />
                              <span className="mr-1 text-gray-600">
                                Cập nhật:
                              </span>{" "}
                              {formatDate(q?.updatedDate || q?.createdDate)}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 rounded-full bg-secondary/30 px-3 py-1 text-xs font-medium text-primary">
                            <SolutionOutlined />
                            {q?.questions?.length} câu hỏi
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="h-[82vh] w-4/5 overflow-y-auto bg-light/50 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <CardQuestion
            className="bg-white"
            title={
              <div className="flex items-center text-primary">
                <EditOutlined className="mr-2" />
                Tạo bộ câu hỏi
              </div>
            }
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-700">
                  <span className="text-red">*</span> Tiêu đề
                </label>
                <InputCustom
                  name="title"
                  value={state.quiz?.title}
                  onChange={handler.handleQuizChange}
                  placeholder="Nhập tiêu đề bộ câu hỏi"
                  className="w-full rounded-lg border-gray-300 px-4 py-2.5 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-700">
                  <span className="text-red">*</span> Mô tả
                </label>
                <TextareaCustom
                  name="description"
                  value={state.quiz?.description}
                  onChange={handler.handleQuizChange}
                  placeholder="Nhập mô tả chi tiết về bộ câu hỏi"
                  className="w-full rounded-lg border-gray-300 px-4 py-2.5 shadow-sm focus:border-primary focus:ring-primary"
                  rows={4}
                />
              </div>
            </div>
          </CardQuestion>

          {state.quiz?.questions && state.quiz.questions?.length > 0 && (
            <CardQuestion
              className="bg-white"
              title={
                <div className="flex w-full items-center text-primary">
                  <div>
                    <QuestionCircleOutlined className="mr-2" />
                    Danh sách câu hỏi
                  </div>
                  <BadgeQuestionCustom
                    count={state.quiz.questions.length}
                    className="ml-2 bg-primary"
                  />
                </div>
              }
            >
              <div className="space-y-5">
                {state.quiz?.questions &&
                  state.quiz.questions?.length > 0 &&
                  state.quiz.questions?.map((question, qIndex) => (
                    <CardQuestion
                      key={qIndex}
                      className="border-gray-200 shadow-sm transition-all hover:shadow"
                      title={
                        <div className="flex items-center space-x-2 text-gray-800">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E1EACD] text-sm font-medium text-primary">
                            {qIndex + 1}
                          </span>
                          <span className="font-medium">
                            Câu hỏi {qIndex + 1}
                          </span>
                        </div>
                      }
                      extra={
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handler.editQuestion(qIndex)}
                            type="text"
                            size="small"
                            className="flex items-center justify-center !border-none !bg-transparent text-primary !shadow-none"
                            icon={<EditOutlined />}
                          />
                          <Button
                            onClick={() => handler.removeQuestion(qIndex)}
                            danger
                            type="text"
                            size="small"
                            className="flex items-center justify-center !border-none !bg-transparent !shadow-none"
                            icon={<DeleteOutlined className="text-red" />}
                          />
                        </div>
                      }
                    >
                      <p className="mb-4 text-base text-gray-800">
                        {question.content}
                      </p>
                      <Divider className="my-4" />
                      <div className="grid grid-cols-2 gap-3">
                        {question?.answerOptions.map(
                          (option: any, index: any) => (
                            <div
                              key={index}
                              className="flex items-center rounded-lg bg-secondary/30 p-3 text-base text-gray-700 transition-colors"
                            >
                              <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white font-medium text-gray-700 shadow-sm">
                                {String.fromCharCode(65 + index)}
                              </span>
                              <span>{option?.content}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </CardQuestion>
                  ))}
              </div>
            </CardQuestion>
          )}

          {/* add + edit */}
          <div ref={state.cardRef}>
            <CardQuestion
              className="bg-white"
              title={
                <div className="flex items-center text-primary">
                  {state.editingQuestionIndex !== null ? (
                    <>
                      <EditOutlined className="mr-2" />
                      Chỉnh sửa câu hỏi {state.editingQuestionIndex + 1}
                    </>
                  ) : (
                    <>
                      <PlusCircleOutlined className="mr-2" />
                      Thêm câu hỏi mới
                    </>
                  )}
                </div>
              }
            >
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-700">
                    <span className="text-red">*</span> Nội dung câu hỏi
                  </label>
                  <InputCustom
                    value={state.currentQuestion?.content}
                    onChange={handler.handleQuestionChange}
                    placeholder="Nhập nội dung câu hỏi"
                    className="w-full rounded-lg border-gray-300 px-4 py-2.5 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <Divider orientation="left" className="my-6">
                  <span className="text-sm font-medium text-gray-500">
                    Các lựa chọn
                  </span>
                </Divider>
                <div className="space-y-4">
                  <label className="block text-base font-semibold text-gray-700">
                    <span className="text-red">*</span> Lựa chọn
                  </label>
                  {state.currentQuestion?.answerOptions &&
                    state?.currentQuestion.answerOptions?.length > 0 &&
                    state.currentQuestion.answerOptions?.map(
                      (option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#E1EACD] text-sm font-medium text-primary">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <div className="flex-grow">
                            <InputCustom
                              value={option.content}
                              onChange={(e) =>
                                handler.handleAnswerChange(index, e)
                              }
                              placeholder={`Nhập đáp án ${index + 1}`}
                              className="w-full rounded-lg border-gray-300 px-4 py-2 shadow-sm focus:border-primary focus:ring-primary"
                            />
                          </div>

                          <Button
                            onClick={() => handler.removeAnswer(index)}
                            type="text"
                            disabled={
                              state.currentQuestion.answerOptions.length <= 2
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full !border-none !bg-transparent"
                            icon={<CloseOutlined className="text-red" />}
                          />
                        </div>
                      ),
                    )}
                </div>

                <div className="flex items-center space-x-4 pt-2">
                  <Button
                    type="dashed"
                    onClick={handler.addAnswer}
                    icon={<PlusCircleOutlined />}
                    className="flex items-center border-primary text-primary hover:border-[#4d766d] hover:text-[#4d766d]"
                  >
                    Thêm lựa chọn
                  </Button>

                  <ButtonCustom
                    onClick={handler.addQuestion}
                    disabled={!state.currentQuestion?.content.trim()}
                    className="flex items-center gap-x-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-[#4d766d] disabled:bg-gray-300"
                  >
                    {state.editingQuestionIndex !== null ? (
                      <>
                        <SaveOutlined />
                        <span>Cập nhật câu hỏi</span>
                      </>
                    ) : (
                      <>
                        <PlusCircleOutlined />
                        <span>Thêm câu hỏi</span>
                      </>
                    )}
                  </ButtonCustom>

                  {state.editingQuestionIndex !== null && (
                    <ButtonCustom
                      onClick={handler.cancelEditQuestion}
                      className="flex items-center gap-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <CloseOutlined />
                      <span>Hủy chỉnh sửa</span>
                    </ButtonCustom>
                  )}
                </div>
              </div>
            </CardQuestion>
          </div>
          <div className="mt-8 flex justify-center">
            <ButtonCustom
              onClick={state.isEditing ? handler.updateQuiz : handler.saveQuiz}
              disabled={
                state.quiz.questions?.length === 0 || !state.quiz?.title.trim()
              }
              className="flex h-12 items-center gap-x-2 rounded-lg bg-primary px-8 py-3 text-base font-medium text-white shadow-md hover:bg-[#4d766d] disabled:bg-gray-300"
            >
              <SaveOutlined className="text-xl" />
              {state.isEditing ? "Cập nhật bộ câu hỏi" : "Lưu bộ câu hỏi"}
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
};

export { QuizCreator };
