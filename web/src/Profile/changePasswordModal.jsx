import React, { useState, useContext, useRef } from 'react'
import { Button, Form, FormControl, FormGroup, FormLabel, Modal, ModalBody, ModalHeader } from 'react-bootstrap'
import { UserContext } from '../context/UserContext'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthenticationContext'

function ChangePasswordModal({ show, handleCloseModal, userPhone }) {

    const { changePassword } = useContext(UserContext)
    const { verifyOTP } = useContext(AuthContext)

    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState({ newPassword: '', confirmPassword: '' })
    const [formType, setFormType] = useState('verifyOTP')

    // Tạo ref để focus
    const otpRef = useRef(null)
    const newPwdRef = useRef(null)
    const confirmPwdRef = useRef(null)

    const handleVerifyOTP = async (e) => {
        e.preventDefault()

        if (!otp.trim()) {
            setError({ otp: "Vui lòng nhập mã OTP" })
            otpRef.current.focus()
            return
        }

        try {
            await verifyOTP(userPhone, otp)
            console.log('phone: ', userPhone)
            console.log('otp: ', otp)

            toast.success("Xác thực OTP thành công")
            setFormType("changePassword") // → chuyển sang form đổi mật khẩu

        } catch (e) {
            toast.error("Lỗi xác thực OTP")
        }
    }

    const handleChangePwd = async (e) => {
        e.preventDefault();
        let hasError = false;

        const newError = { newPassword: '', confirmPassword: '' }

        if (newPassword.trim() === '') {
            newError.newPassword = 'Vui lòng nhập mật khẩu mới'
            newPwdRef.current.focus()
            hasError = true
        }
        if (confirmPassword.trim() === '') {
            newError.confirmPassword = 'Vui lòng xác nhận mật khẩu'
            if (!hasError) confirmPwdRef.current.focus()
            hasError = true
        }

        // Kiểm tra trùng
        if (newPassword !== confirmPassword) {
            newError.confirmPassword = 'Mật khẩu xác nhận không trùng khớp'
            if (!hasError) confirmPwdRef.current.focus()
            hasError = true
        }

        setError(newError)

        if (hasError) return

        try {
            await changePassword(userPhone, confirmPassword)
            toast.success('Đổi mật khẩu thành công')
            handleCloseModal()
        }
        catch (err) {
            toast.error('Đổi mật khẩu không thành công');
            return
        }

    }

    const resetForm = () => {
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setError({ newPassword: '', confirmPassword: '', otp: '' });
        setFormType('verifyOTP');   // <--- RESET về bước verify OTP
    };

    const closeModal = () => {
        resetForm();
        handleCloseModal();
    };

    return (
        <>
            <Modal
                show={show}
                onHide={closeModal}
                centered
                backdrop={true}
                keyboard={false}
                scrollable
                size="xl"
            >
                <ModalHeader closeButton>
                    Đổi mật khẩu mới
                </ModalHeader>
                <ModalBody>

                    {/* ====================== VerifyOTP ====================== */}
                    {formType === "verifyOTP" && (
                        <Form onSubmit={handleVerifyOTP}>
                            <FormGroup>
                                <FormLabel>Nhập mã OTP</FormLabel>
                                <FormControl
                                    type="text"
                                    value={otp}
                                    ref={otpRef}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder='Nhập mã OTP gửi đến email/số điện thoại'
                                    isInvalid={!!error.otp}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error.otp}
                                </Form.Control.Feedback>
                            </FormGroup>

                            <Button style={{ marginTop: '12px' }} type="submit">
                                Xác nhận OTP
                            </Button>
                        </Form>
                    )}

                    {/* ====================== FORM CHANGE PASSWORD ====================== */}
                    {formType === "changePassword" && (
                        <Form onSubmit={handleChangePwd}>
                            <FormGroup>
                                <FormLabel>Nhập mật khẩu mới</FormLabel>
                                <FormControl type='password'
                                    value={newPassword}
                                    ref={newPwdRef}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder='Nhập mật khẩu mới'
                                    isInvalid={!!error.newPassword} />
                                <Form.Control.Feedback type="invalid">
                                    {error.newPassword}
                                </Form.Control.Feedback>

                                <FormLabel>Xác nhận lại mật khẩu</FormLabel>
                                <FormControl type='password'
                                    value={confirmPassword}
                                    ref={confirmPwdRef}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder='Nhập lại mật khẩu 1 lần nữa'
                                    isInvalid={!!error.confirmPassword} />
                                <Form.Control.Feedback type="invalid">
                                    {error.confirmPassword}
                                </Form.Control.Feedback>
                            </FormGroup>
                            <Button style={{ marginTop: '10px' }} type='submit'>Đổi mật khẩu</Button>
                        </Form>
                    )}
                </ModalBody>
            </Modal>
        </>
    )
}

export default ChangePasswordModal
