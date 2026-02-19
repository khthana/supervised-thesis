import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/authentication/presentation/bloc/auth_bloc.dart';

class LoginScreen extends StatelessWidget {
  final ValueNotifier<bool> _isObscure = ValueNotifier<bool>(true);

  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  LoginScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: Container(
        color: AppColors.backgroundColor,
        child: Stack(
          children: [
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: SvgPicture.asset(
                AppImages.skyBgImage,
                height: MediaQuery.of(context).size.height * 0.5,
              ),
            ),
            Positioned(
              bottom: -110,
              left: 0,
              right: 0,
              child: SvgPicture.asset(
                AppImages.seaBgImage,
                fit: BoxFit.cover,
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 184.0),
              child: Column(children: [
                Text(
                  AppStrings.loginText,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 36, 20, 20),
                  child: TextField(
                    controller: _emailController,
                    style: Theme.of(context).textTheme.bodySmall,
                    decoration: InputDecoration(
                      labelText: 'อีเมล',
                      labelStyle: Theme.of(context).textTheme.bodySmall,
                      contentPadding:
                          const EdgeInsets.only(left: 20, top: 7, bottom: 7),
                      hintStyle: Theme.of(context).textTheme.bodySmall,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding:
                      const EdgeInsets.only(bottom: 20, left: 20, right: 20),
                  child: ValueListenableBuilder<bool>(
                    valueListenable: _isObscure,
                    builder: (context, isObscure, child) {
                      return TextField(
                        controller: _passwordController,
                        obscureText: isObscure,
                        style: Theme.of(context).textTheme.bodySmall,
                        decoration: InputDecoration(
                          labelText: 'รหัสผ่าน',
                          labelStyle: Theme.of(context).textTheme.bodySmall,
                          contentPadding: const EdgeInsets.only(
                              left: 20, top: 14, bottom: 14),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          suffixIcon: IconButton(
                            icon: Icon(
                              isObscure
                                  ? Icons.visibility
                                  : Icons.visibility_off,
                            ),
                            onPressed: () {
                              _isObscure.value = !_isObscure.value;
                            },
                          ),
                        ),
                      );
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 24.0, bottom: 20),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      GestureDetector(
                        onTap: () {
                          debugPrint('forget password!!');
                          context.goNamed(AppPages.forgetPasswordName);
                        },
                        child: Text(
                          'ลืมรหัสผ่าน',
                          style:
                              Theme.of(context).textTheme.bodySmall!.copyWith(
                                    color: AppColors.darkGrayColor,
                                    decoration: TextDecoration.underline,
                                  ),
                        ),
                      ),
                    ],
                  ),
                ),
                BlocConsumer<AuthBloc, AuthState>(
                  listener: (context, state) {
                    if (state is AuthSuccess && state.statusCode == 201) {
                      // Navigate to home page on successful login
                      context.goNamed(AppPages.homeName);
                    } else if (state is AuthFailure &&
                        state.statusCode == 401) {
                      // Show error message for invalid credentials
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('อีเมลหรือรหัสผ่านไม่ถูกต้อง'),
                          backgroundColor: Colors.red,
                        ),
                      );
                    }
                  },
                  builder: (context, state) {
                    if (state is AuthLoading) {
                      return const CircularProgressIndicator();
                    }

                    return ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        foregroundColor: AppColors.whiteColor,
                        backgroundColor: AppColors.primaryColor,
                        minimumSize: const Size(350, 60),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16.0),
                        ),
                      ),
                      onPressed: () {
                        debugPrint(
                            'Email: ${_emailController.text}, Password: ${_passwordController.text}');

                        if (_emailController.text.isEmpty ||
                            _passwordController.text.isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('กรุณากรอกข้อมูลให้ครบถ้วน'),
                              backgroundColor: Colors.red,
                            ),
                          );
                        } else {
                          context.read<AuthBloc>().add(
                                LoginEvent(
                                  email: _emailController.text,
                                  password: _passwordController.text,
                                ),
                              );
                        }
                      },
                      child: Text(
                        AppStrings.loginText,
                        style: Theme.of(context)
                            .textTheme
                            .bodyMedium!
                            .copyWith(color: AppColors.whiteColor),
                      ),
                    );
                  },
                ),
                // Rest of the widgets...
              ]),
            ),
          ],
        ),
      ),
    );
  }
}
