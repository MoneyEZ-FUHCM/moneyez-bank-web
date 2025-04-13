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
import { useDecryptCredentials } from "@/hooks/useDecryptCredentials";
import { LoadingOutlined } from "@ant-design/icons";
import { Checkbox, Form, Spin } from "antd";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { AUTH_CONSTANT } from "../../auth.constant";
import { TEXT_TRANSLATE } from "../../auth.translate";
import { useLoginPage } from "../../hooks/useLoginPage";
import { ForgotPasswordForm } from "../forgot-pass/forgot-password";
import { RegisterForm } from "../register/register";
import { PATH_NAME } from "@/helpers/constants/pathname";

const LoginForm = () => {
  const [form] = Form.useForm();
  const { FORM_NAME, MAX_LENGTH_OTP } = AUTH_CONSTANT;
  const { MESSAGE_VALIDATE, TITLE, BUTTON, LABEL } = TEXT_TRANSLATE;
  const { email, password } = useDecryptCredentials();
  const { state, handler } = useLoginPage(form);

  return (
    <Fragment>
      {state.isShowForgotPassword ? (
        <ForgotPasswordForm
          isShowRegister={state.isShowRegister}
          setIsShowRegister={handler.setIsShowRegister}
        />
      ) : !state.isShowRegister ? (
        <section className="py-10">
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-center text-2xl font-bold uppercase text-primary transition-all duration-500 lg:text-3xl">
              {TITLE.WELCOME_BACK}
            </h1>
            <p className="text-sms mx-4 mb-5 mt-3 text-center text-[#a3a1a1] transition-all duration-500 lg:mx-9 lg:text-[15px]">
              {TITLE.SUB_GREETING}{" "}
              <Link
                href={PATH_NAME.HOME}
                // onClick={() => handler.handleBackToHome}
                className="group relative cursor-pointer text-base font-bold text-primary"
              >
                {TITLE.WEB_NAME}
                <span className="absolute bottom-[-3px] left-0 h-0.5 w-full scale-x-0 transform bg-primary transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
              <span>. </span>
              {TITLE.START}
            </p>
          </motion.div>
          <Form className="login-form" form={form} onFinish={handler.onFinish}>
            <motion.div
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-9"
            >
              <Form.Item
                name={FORM_NAME.EMAIL}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: MESSAGE_VALIDATE.EMAIL_REQUIRED,
                  },
                  {
                    type: "email",
                    message: MESSAGE_VALIDATE.INPUT_EMAIL,
                  },
                ]}
                colon={true}
                labelCol={{ span: 24 }}
                className="formItem"
                initialValue={email}
              >
                <InputCustom
                  placeholder={LABEL.EMAIL}
                  type="email"
                  className="hover:border-primary focus:border-primary"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.code === "Space") {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </motion.div>
            <motion.div
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Form.Item
                name={FORM_NAME.PASSWORD}
                rules={[
                  {
                    required: true,
                    message: MESSAGE_VALIDATE.PASSWORD_REQUIRED,
                  },
                  {
                    min: 8,
                    message: MESSAGE_VALIDATE.PASSWORD_8_CHARACTERS,
                  },
                ]}
                labelCol={{ span: 24 }}
                className="formItem"
                initialValue={password}
                hasFeedback
              >
                <InputCustom
                  placeholder={LABEL.PASSWORD}
                  type="password"
                  className="hover:border-primary focus:border-primary"
                  onKeyPress={(e) => {
                    if (e.code === "Space") {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <Form.Item
                name="remember"
                valuePropName="checked"
                noStyle
                className="mt-4"
              >
                <Checkbox
                  onChange={(e) => handler.setRememberMe(e.target.checked)}
                >
                  {BUTTON.REMEMBER_ME}
                </Checkbox>
                <Link
                  href="#"
                  className="group relative float-right cursor-pointer font-semibold text-primary hover:text-primary"
                  onClick={() => handler.setIsShowForgotPassword(true)}
                >
                  {BUTTON.FORGOT_PASSWORD}
                  <span className="absolute bottom-[-3px] left-0 h-0.5 w-full scale-x-0 transform bg-primary transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </Form.Item>
            </motion.div>
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1 }}
            >
              <Drawer
                open={state.isDrawerVisible}
                onClose={handler.handleDrawerClose}
              >
                <DrawerTrigger asChild>
                  <Form.Item noStyle>
                    <ButtonCustom
                      disabled={state.isLoggingIn}
                      className="mx-auto mt-5 flex h-11 w-full items-center rounded-[5px] bg-primary text-lg tracking-wider text-superlight hover:bg-primary/80"
                    >
                      {state.isLoggingIn ? (
                        <Spin
                          indicator={
                            <LoadingOutlined className="text-superlight" />
                          }
                        />
                      ) : (
                        `${BUTTON.LOGIN}`
                      )}
                    </ButtonCustom>
                  </Form.Item>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
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
                            type="number"
                            maxLength={MAX_LENGTH_OTP}
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
                          disabled={state.isVerifyingEmail}
                          className="mx-auto flex h-11 w-full items-center rounded-[5px] bg-primary text-sm tracking-wider text-superlight hover:bg-primary/80"
                          onClick={handler.handleOTPSubmit}
                        >
                          {state.isVerifyingEmail ? (
                            <Spin
                              indicator={
                                <LoadingOutlined className="text-[#fff]" />
                              }
                            />
                          ) : (
                            `${BUTTON.CONFIRM_OTP}`
                          )}
                        </ButtonCustom>
                      </DrawerFooter>
                    </motion.div>
                  </div>
                </DrawerContent>
              </Drawer>
            </motion.div>
          </Form>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="mt-4 flex items-center justify-center text-center">
              <div className="mr-2 h-[1px] w-full bg-[#e6e8eb]"></div>
              <span className="text-[#999999]">{TITLE.OR}</span>
              <div className="ml-2 h-[1px] w-full bg-[#e6e8eb]"></div>
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ButtonCustom
              onClick={handler.handleGoogleSignIn}
              disabled={state.isLoggingInGoogle}
              className="mx-auto mt-5 block h-11 w-full rounded-[5px] border border-gray-300 bg-[#fff] text-[grey] shadow-none hover:!border-primary hover:!bg-transparent hover:!text-primary"
            >
              {state.isLoggingInGoogle ? (
                <Spin
                  indicator={<LoadingOutlined className="text-primary" />}
                />
              ) : (
                <div className="flex items-center justify-center tracking-wider">
                  <Image
                    src="https://freesvg.org/img/1534129544.png"
                    width={30}
                    height={30}
                    quality={100}
                    alt=""
                    className="mr-2"
                  />
                  {BUTTON.LOGIN_WITH_GOOGLE}
                </div>
              )}
            </ButtonCustom>
            <div className="mt-3 text-center text-sm">
              <span className="text-[#4d4d4d]">{TITLE.DONOT_HAVE_ACCOUNT}</span>{" "}
              <Link
                href="#"
                className="login-form-forgot group relative cursor-pointer font-semibold text-primary hover:text-primary"
                onClick={() => handler.setIsShowRegister(true)}
              >
                {BUTTON.REGISTER}
                <span className="absolute bottom-[-3px] left-0 h-0.5 w-full scale-x-0 transform bg-primary transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </div>
          </motion.div>
        </section>
      ) : (
        <RegisterForm
          isShowRegister={state.isShowRegister}
          setIsShowRegister={handler.setIsShowRegister}
        />
      )}
    </Fragment>
  );
};

export { LoginForm };
