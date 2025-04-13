"use client";

import { ButtonCustom } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { InputCustom } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoadingOutlined } from "@ant-design/icons";
import { Form, Spin } from "antd";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { AUTH_CONSTANT } from "../../auth.constant";
import { TEXT_TRANSLATE } from "../../auth.translate";
import { useForgotPasswordPage } from "../../hooks/useForgotPasswordPage";
import { RegisterForm } from "../register/register";

interface IForgotPassProps {
  isShowRegister: boolean;
  setIsShowRegister: React.Dispatch<React.SetStateAction<boolean>>;
}

const ForgotPasswordForm = (props: IForgotPassProps) => {
  const [form] = Form.useForm();
  const { handler, state } = useForgotPasswordPage(
    form,
    props.setIsShowRegister,
  );
  const { TITLE, MESSAGE_VALIDATE, BUTTON, LABEL } = TEXT_TRANSLATE;
  const { FORM_NAME } = AUTH_CONSTANT;

  return (
    <>
      {!props.isShowRegister ? (
        <section className="py-5">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="mb-7 text-center text-2xl font-bold uppercase text-primary transition-all duration-500 sm:text-2xl md:text-3xl">
              {TITLE.FORGOT_PASSWORD}
            </h1>
          </motion.div>
          <Form form={form} onFinish={handler.onFinish} className="login-form">
            <motion.div
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 1 }}
            >
              <Form.Item
                name={FORM_NAME.EMAIL}
                rules={[
                  { required: true, message: MESSAGE_VALIDATE.EMAIL_REQUIRED },
                  { type: "email", message: MESSAGE_VALIDATE.INPUT_EMAIL },
                ]}
              >
                <InputCustom
                  placeholder="Email"
                  className="hover:border-primary focus:border-primary"
                  autoFocus
                />
              </Form.Item>
            </motion.div>
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1 }}
              className="mt-8"
            >
              <Drawer
                open={state.isDrawerVisible}
                onClose={handler.handleDrawerClose}
              >
                <DrawerTrigger asChild>
                  <Form.Item noStyle>
                    <ButtonCustom
                      disabled={state.isLoadingResetPassword}
                      className="mx-auto flex h-11 w-full items-center rounded-[5px] bg-primary text-lg tracking-wider text-superlight hover:bg-primary/80"
                    >
                      {state.isLoadingResetPassword ? (
                        <Spin
                          indicator={
                            <LoadingOutlined className="text-[#fff]" />
                          }
                        />
                      ) : (
                        `${BUTTON.SEND}`
                      )}
                    </ButtonCustom>
                  </Form.Item>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
                    {!state.isOTPSubmitted ? (
                      <motion.div
                        key="enterOTP"
                        initial={{ x: 0, opacity: 1 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -150, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <DrawerHeader>
                          <DrawerTitle className="text-2xl">
                            {TITLE.INPUT_OTP}
                          </DrawerTitle>
                          <DrawerDescription className="text-[#a3a1a1]">
                            {TITLE.INPUT_OTP_FROM_MAIL}
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="pb-0">
                          <div className="flex items-center justify-center space-x-2 px-5">
                            <InputOTP
                              maxLength={5}
                              className="px-5"
                              onChange={(value) => handler.setOtpCode(value)}
                              onInput={(e: any) =>
                                (e.target.value = e.target.value.replace(
                                  /\D/g,
                                  "",
                                ))
                              }
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                        </div>
                        <DrawerFooter>
                          <ButtonCustom
                            disabled={
                              state.isLoadingConfirmOtp || state.isResending
                            }
                            className="mx-auto flex h-11 w-full items-center rounded-[5px] bg-primary text-sm tracking-wider text-superlight hover:bg-primary/80"
                            onClick={handler.handleOTPSubmit}
                          >
                            {state.isLoadingConfirmOtp ? (
                              <Spin
                                indicator={
                                  <LoadingOutlined className="text-primary" />
                                }
                              />
                            ) : (
                              `${BUTTON.RECOVERY}`
                            )}
                          </ButtonCustom>
                          <ButtonCustom
                            disabled={
                              state.isLoadingConfirmOtp || state.isResending
                            }
                            onClick={handler.handleResendMail}
                            className="mx-auto block h-11 w-full rounded-[5px] border border-gray-300 bg-[#fff] shadow-none hover:!border-primary hover:!bg-transparent hover:!text-primary"
                          >
                            {state.isResending ? (
                              <Spin
                                indicator={
                                  <LoadingOutlined className="text-primary" />
                                }
                              />
                            ) : (
                              `${BUTTON.RESEND}`
                            )}
                          </ButtonCustom>
                        </DrawerFooter>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="resetPassword"
                        initial={{ x: 150, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 150, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <DrawerHeader>
                          <DrawerTitle className="text-2xl">
                            {TITLE.RESET_PASSWORD}
                          </DrawerTitle>
                          <DrawerDescription className="text-[#a3a1a1]">
                            {TITLE.INPUT_NEW_PASSWORD_CONFIRM}
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="pb-0">
                          <div className="px-5">
                            <Form.Item
                              name={FORM_NAME.PASSWORD}
                              rules={[
                                {
                                  required: true,
                                  message: MESSAGE_VALIDATE.PASSWORD_REQUIRED,
                                },
                                {
                                  min: 8,
                                  message:
                                    MESSAGE_VALIDATE.PASSWORD_8_CHARACTERS,
                                },
                              ]}
                              className="mb-7"
                            >
                              <InputCustom
                                type="password"
                                placeholder={LABEL.PASSWORD}
                                className="w-full hover:border-primary focus:border-primary"
                                autoFocus
                              />
                            </Form.Item>
                            <Form.Item
                              name="confirmPassword"
                              rules={[
                                {
                                  required: true,
                                  message:
                                    MESSAGE_VALIDATE.CONFIRM_PASSWORD_REQUIRED,
                                },
                                { validator: handler.validatePassword },
                              ]}
                            >
                              <InputCustom
                                placeholder={LABEL.CONFIRM_PASSWORD}
                                type="password"
                                className="hover:border-primary focus:border-primary"
                              />
                            </Form.Item>
                          </div>
                        </div>
                        <DrawerFooter>
                          <ButtonCustom
                            disabled={state.isConfirmNewPassword}
                            className="mx-auto flex h-11 w-full items-center rounded-[5px] bg-primary text-sm tracking-wider text-superlight hover:bg-primary/80"
                            onClick={handler.handleResetPassword}
                          >
                            {state.isConfirmNewPassword ? (
                              <Spin
                                indicator={
                                  <LoadingOutlined className="text-superlight" />
                                }
                              />
                            ) : (
                              `${BUTTON.CONFIRM}`
                            )}
                          </ButtonCustom>
                        </DrawerFooter>
                      </motion.div>
                    )}
                  </div>
                </DrawerContent>
              </Drawer>
              <div className="mt-3 text-center text-sm">
                <span className="text-[#4d4d4d]">{TITLE.HAD_ACCOUNT}</span>{" "}
                <Link
                  href="#"
                  className="login-form-forgot group relative cursor-pointer font-semibold text-primary hover:text-primary"
                  onClick={() => props.setIsShowRegister(true)}
                >
                  {BUTTON.LOGIN}
                  <span className="absolute bottom-[-3px] left-0 h-0.5 w-full scale-x-0 transform bg-primary transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </div>
            </motion.div>
          </Form>
        </section>
      ) : (
        <RegisterForm
          isShowRegister={false}
          setIsShowRegister={props.setIsShowRegister}
        />
      )}
    </>
  );
};

export { ForgotPasswordForm };
