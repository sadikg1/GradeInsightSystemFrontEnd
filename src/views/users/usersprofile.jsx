import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Avatar, Box, Typography, Card, CardContent, TextField, Button, FormControl, InputLabel, FilledInput, InputAdornment, IconButton, MenuItem } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const UsersProfile = ({ initialValues, userTypes, onSubmit, onPasswordChange, onClose,  }) => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   

    const handleClickNewShowPassword = () => setShowNewPassword((show) => !show);
    const handleClickConfirmShowPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const generalInfoValidationSchema = Yup.object({
        userName: Yup.string()
          .max(100, 'Username must be at most 100 characters')
          .required('Required'),
        userEmail: Yup.string()
          .email('Invalid email address')
          .required('Required'),
        userFullName: Yup.string()
          .required('Required'),
        userTypeName: Yup.string()
          .required('Required')
      });
      
      const passwordValidationSchema = Yup.object({
  newPassword: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/,
      'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Required'),

        confirmPassword: Yup.string()
          .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
          .required('Required')
      });

    // const canModifyPassword = loggedInUser.userId === 2 || loggedInUser.userTypeId === 1;
    // const canAssignRoles = loggedInUser.userTypeId === 1 || loggedInUser.userTypeId === 2;

    return (
        <Box>
            {initialValues.userId && (
                <Box display="flex" justifyContent="center" px={2} width="100%">
                    <Card elevation={2} sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Avatar
                            alt="User Profile Picture"
                            sx={{ width: 100, height: 100, m: 2 }}
                        >
                            {initialValues.userFullName.charAt(0)}
                        </Avatar>
                        <CardContent>
                            <Typography variant="h3">{initialValues.userName}</Typography>
                            <Typography variant="body1">{initialValues.userFullName}</Typography>
                            <Typography variant="body1">{initialValues.userEmail}</Typography>
                            <Typography variant="body1">{initialValues.userTypeName}</Typography>
                        </CardContent>
                    </Card>
                </Box>
            )}

            <Box display="flex" justifyContent="space-between" p={2} width="100%">
                <Typography variant="h4">General Information</Typography>
            </Box>

            <Formik
                initialValues={initialValues}
                validationSchema={generalInfoValidationSchema}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {({ handleChange, handleBlur, values, errors, touched,isSubmitting }) => (
                    <Form>
                        <Box
                            display="flex"
                            px={2}
                            sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
                            flexDirection="column"
                        >
                            <Box display="flex">
                                <TextField
                                    required
                                    id="userName"
                                    label="Username"
                                    variant="filled"
                                    name="userName"
                                    value={values.userName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.userName && Boolean(errors.userName)}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    required
                                    id="userEmail"
                                    label="Email"
                                    variant="filled"
                                    name="userEmail"
                                    value={values.userEmail}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.userEmail && Boolean(errors.userEmail)}
                                    sx={{ marginBottom: 2 }}
                                />
                            </Box>

                            <Box display="flex">
                                <TextField
                                    required
                                    id="userFullName"
                                    label="Full Name"
                                    variant="filled"
                                    name="userFullName"
                                    value={values.userFullName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.userFullName && Boolean(errors.userFullName)}
                                    sx={{ marginBottom: 2 }}
                                />
                            </Box>

                             
                                <Box display="flex">
                                    <TextField
                                        id="select-department"
                                        select
                                        label="Department"
                                        variant="filled"
                                        name="userTypeName"
                                        value={values.userTypeName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.userTypeName && Boolean(errors.userTypeName)}
                                        sx={{ marginBottom: 2 }}
                                    >
                                        {userTypes.map((type) => (
                                            <MenuItem key={type.userTypeId} value={type.userTypeName}>
                                                {type.userTypeName}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                            

                            {!initialValues.userId && (
                                <>
                                    <Box display="flex" justifyContent="space-between" p={2} width="100%">
                                        <Typography variant="h4">Password Information</Typography>
                                    </Box>

                                    <Box display="flex">
                                        <FormControl sx={{ m: 1, width: '50%' }} variant="filled">
                                            <InputLabel htmlFor="enter-new-password">Enter New Password</InputLabel>
                                            <FilledInput
                                                id="enter-new-password"
                                                type={showNewPassword ? 'text' : 'password'}
                                                name="newPassword"
                                                value={values.newPassword}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.newPassword && Boolean(errors.newPassword)}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickNewShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            onMouseUp={handleMouseUpPassword}
                                                            edge="end"
                                                        >
                                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                helperText={touched.newPassword && errors.newPassword ? errors.newPassword : 'Enter your new password'}
                                            />
                                            <ErrorMessage name="newPassword" component="div" />
                                        </FormControl>
                                        <FormControl sx={{ m: 1, width: '50%' }} variant="filled">
                                            <InputLabel htmlFor="confirm-new-password">Confirm New Password</InputLabel>
                                            <FilledInput
                                                id="confirm-new-password"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={values.confirmPassword}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickConfirmShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            onMouseUp={handleMouseUpPassword}
                                                            edge="end"
                                                        >
                                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                helperText={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : 'Confirm your new password'}
                                            />
                                            <ErrorMessage name="confirmPassword" component="div" />
                                        </FormControl>
                                    </Box>
                                </>
                            )}

                            <Box display="flex" justifyContent="right" px={1}>
                                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                                    {initialValues.userId ? 'Update Information' : 'Add User'}
                                </Button>
                            </Box>
                        </Box>
                    </Form>
                )}
            </Formik>

            { initialValues.userId && (
                <Formik
                    initialValues={{
                        newPassword: '',
                        confirmPassword: ''
                    }}
                    validationSchema={passwordValidationSchema}
                    onSubmit={onPasswordChange}
                >
                    {({ handleChange, handleBlur, values, errors, touched ,isSubmitting}) => (
                        <Form>
                            <Box display="flex" justifyContent="space-between" p={2} width="100%">
                                <Typography variant="h4">Password Information</Typography>
                            </Box>
                            <Box display="flex" px={2} sx={{ '& .MuiTextField-root': { m: 1, width: '50%' } }} flexDirection="row">
                                <FormControl sx={{ m: 1, width: '50%' }} variant="filled">
                                    <InputLabel htmlFor="enter-new-password">Enter New Password</InputLabel>
                                    <FilledInput
                                        id="enter-new-password"
                                        type={showNewPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        value={values.newPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.newPassword && Boolean(errors.newPassword)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickNewShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    onMouseUp={handleMouseUpPassword}
                                                    edge="end"
                                                >
                                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        helperText={touched.newPassword && errors.newPassword ? errors.newPassword : 'Enter your new password'}
                                    />
                                    <ErrorMessage name="newPassword" component="div" />
                                </FormControl>
                                <FormControl sx={{ m: 1, width: '50%' }} variant="filled">
                                    <InputLabel htmlFor="confirm-new-password">Confirm New Password</InputLabel>
                                    <FilledInput
                                        id="confirm-new-password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickConfirmShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    onMouseUp={handleMouseUpPassword}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        helperText={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : 'Confirm your new password'}
                                    />
                                    <ErrorMessage name="confirmPassword" component="div" />
                                </FormControl>
                            </Box>
                            <Box display="flex" justifyContent="right" px={3}>
                                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                                    Change Password
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            )}
        </Box>
    );
};

export default UsersProfile;