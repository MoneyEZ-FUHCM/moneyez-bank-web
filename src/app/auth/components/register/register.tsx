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
import { Fragment } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { AUTH_CONSTANT } from "../../auth.constant";
import { TEXT_TRANSLATE } from "../../auth.translate";
import { useRegisterPage } from "../../hooks/useRegisterPage";
import { LoginForm } from "../login/login";

interface IRegisterProps {
  isShowRegister: boolean;
  setIsShowRegister: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterForm = (props: IRegisterProps) => {
  const [form] = Form.useForm();
  const { FORM_NAME, MAX_LENGTH_OTP } = AUTH_CONSTANT;
  const { MESSAGE_VALIDATE, TITLE, BUTTON, LABEL } = TEXT_TRANSLATE;
  const { handler, state } = useRegisterPage(form);

  return (
    <Fragment>
      {props.isShowRegister ? (
        <section className="py-5">
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 1 }}
            className="my-5"
          >
            <h1 className="text-center text-3xl font-bold text-primary transition-all duration-500 lg:text-4xl">
              {TITLE.REGISTER}
            </h1>
          </motion.div>
          <Form
            name="register_form"
            className="w-full"
            form={form}
            onFinish={handler.onFinish}
          >
            <motion.div
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
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
              className="mb-8"
            >
              <Form.Item
                name={FORM_NAME.NAME}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: MESSAGE_VALIDATE.NAME_REQUIRED,
                  },
                ]}
                colon={true}
                labelCol={{ span: 24 }}
                className="formItem"
              >
                <InputCustom
                  placeholder={LABEL.FULLNAME}
                  type="text"
                  className="hover:border-primary focus:border-primary"
                />
              </Form.Item>
            </motion.div>
            <motion.div
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <Form.Item
                name={FORM_NAME.PHONE_NUMBER}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: MESSAGE_VALIDATE.PHONE_NUMBER_REQUIRED,
                  },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: MESSAGE_VALIDATE.INPUT_PHONE_NUMBER,
                  },
                ]}
                colon={true}
                labelCol={{ span: 24 }}
                className="formItem"
              >
                <InputCustom
                  placeholder={LABEL.PHONE_NUMBER}
                  type="text"
                  className="hover:border-primary focus:border-primary"
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
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
              className="mb-8"
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
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Form.Item
                name={FORM_NAME.CONFIRM_PASSWORD}
                rules={[
                  {
                    required: true,
                    message: MESSAGE_VALIDATE.CONFIRM_PASSWORD_REQUIRED,
                  },
                  {
                    validator: handler.validateFieldsMatch(
                      "password",
                      MESSAGE_VALIDATE.PASSWORDS_MUST_MATCH,
                    ),
                  },
                ]}
                labelCol={{ span: 24 }}
                className="formItem"
                hasFeedback
              >
                <InputCustom
                  placeholder={LABEL.CONFIRM_PASSWORD}
                  type="password"
                  className="hover:border-primary focus:border-primary"
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                  onKeyPress={(e) => {
                    if (e.code === "Space") {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </motion.div>

            <Form.Item noStyle>
              <div className="mb-3 mt-8 flex w-full max-w-[300px] justify-start">
                <ReCAPTCHA
                  sitekey={state.recaptchaSiteKey}
                  onChange={handler.onCaptchaChange}
                />
              </div>
            </Form.Item>
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
                      disabled={state.isSigningUp}
                      className="mx-auto flex h-11 w-full items-center rounded-[5px] bg-primary text-lg tracking-wider text-superlight hover:bg-primary/80"
                    >
                      {state.isSigningUp ? (
                        <Spin
                          indicator={
                            <LoadingOutlined className="text-[#fff]" />
                          }
                        />
                      ) : (
                        `${BUTTON.REGISTER}`
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
                        <ButtonCustom
                          disabled={state.isResending}
                          onClick={handler.handleResendMail}
                          className="mx-auto block h-11 w-full rounded-[5px] border border-gray-300 bg-[#fff] shadow-none hover:!border-primary hover:!bg-transparent hover:!text-primary"
                        >
                          {state.isResending ? (
                            <Spin
                              indicator={
                                <LoadingOutlined className="text-[#fff]" />
                              }
                            />
                          ) : (
                            `${BUTTON.RESEND}`
                          )}
                        </ButtonCustom>
                      </DrawerFooter>
                    </motion.div>
                  </div>
                </DrawerContent>
              </Drawer>
              <div className="mt-3 text-center text-sm">
                <span className="text-[#4d4d4d]">{TITLE.HAD_ACCOUNT}</span>{" "}
                <Link
                  href="#"
                  className="login-form-forgot group relative cursor-pointer font-semibold text-primary hover:text-primary"
                  onClick={() => props.setIsShowRegister(false)}
                >
                  {BUTTON.LOGIN}
                  <span className="absolute bottom-[-5px] left-0 h-0.5 w-full scale-x-0 transform bg-primary transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </div>
            </motion.div>
          </Form>
        </section>
      ) : (
        <LoginForm />
      )}
    </Fragment>
  );
};

export { RegisterForm };
