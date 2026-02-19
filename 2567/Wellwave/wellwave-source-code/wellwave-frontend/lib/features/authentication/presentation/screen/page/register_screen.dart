import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/authentication/presentation/bloc/auth_bloc.dart';

class RegisterScreen extends StatelessWidget {
  final ValueNotifier<bool> _isObscure = ValueNotifier<bool>(true);
  final ValueNotifier<bool> _isChecked = ValueNotifier<bool>(false);

  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  RegisterScreen({Key? key}) : super(key: key);

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
              padding: const EdgeInsets.only(top: 104.0),
              child: Column(children: [
                Text(
                  AppStrings.registerText,
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
                  padding:
                      const EdgeInsets.only(bottom: 20, left: 20, right: 20),
                  child: ValueListenableBuilder<bool>(
                    valueListenable: _isObscure,
                    builder: (context, isObscure, child) {
                      return TextField(
                        controller: _confirmPasswordController,
                        obscureText: isObscure,
                        style: Theme.of(context).textTheme.bodySmall,
                        decoration: InputDecoration(
                          labelText: 'ยืนยันรหัสผ่าน',
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
                ValueListenableBuilder<bool>(
                  valueListenable: _isChecked,
                  builder: (context, isChecked, child) {
                    return Padding(
                      padding: const EdgeInsets.only(left: 20.0),
                      child: Row(
                        children: [
                          SizedBox(
                            width: 16.0,
                            height: 16.0,
                            child: Checkbox(
                              value: isChecked,
                              onChanged: (bool? value) {
                                _isChecked.value = value ?? false;
                              },
                              activeColor: AppColors.primaryColor,
                              checkColor: AppColors.whiteColor,
                            ),
                          ),
                          const SizedBox(
                            width: 12,
                          ),
                          Flexible(
                            child: Text(
                              'ยินยอมให้ใช้ข้อมูลสุขภาพส่วนบุคคลสำหรับการใช้งานภายในแอปพลิเคชัน',
                              style: Theme.of(context).textTheme.bodySmall,
                              softWrap: true,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
                const SizedBox(height: 20),
                BlocBuilder<AuthBloc, AuthState>(
                  builder: (context, state) {
                    if (state is AuthInitial) {
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
                        if (!_isChecked.value) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content:
                                  Text('กรุณายอมรับข้อตกลงก่อนสมัครสมาชิก'),
                              backgroundColor: Colors.red,
                            ),
                          );
                          return;
                        }
                        if (_emailController.text.isEmpty ||
                            _passwordController.text.isEmpty ||
                            _confirmPasswordController.text.isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('กรุณากรอกข้อมูลให้ครบถ้วน'),
                              backgroundColor: Colors.red,
                            ),
                          );
                        } else if (_passwordController.text !=
                            _confirmPasswordController.text) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('รหัสผ่านไม่ตรงกัน'),
                              backgroundColor: Colors.red,
                            ),
                          );
                        } else {
                          context.read<AuthBloc>().add(
                                RegisterEvent(
                                  email: _emailController.text,
                                  password: _passwordController.text,
                                ),
                              );
                          context.goNamed(AppPages.registerSuccessName);
                          debugPrint('สมัครสมาชิกเรียบร้อย');
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
                Padding(
                  padding: const EdgeInsets.fromLTRB(52, 24.0, 52, 0),
                  child: Row(
                    children: [
                      Expanded(
                        child: Container(
                          margin: const EdgeInsets.only(right: 8.0),
                          height: 1.0,
                          color: Colors.black,
                        ),
                      ),
                      Text(
                        'หรือ',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      Expanded(
                        child: Container(
                          margin: const EdgeInsets.only(left: 8.0),
                          height: 1.0,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(20.0, 24, 20, 24),
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.darkGrayColor,
                      backgroundColor: AppColors.whiteColor,
                      minimumSize: const Size(350, 60),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                    ),
                    onPressed: () {},
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SvgPicture.asset(AppImages.googleIcon),
                        const SizedBox(
                          width: 24,
                        ),
                        Text(
                          'ดำเนินการต่อด้วย Google',
                          style: Theme.of(context)
                              .textTheme
                              .bodyMedium!
                              .copyWith(color: AppColors.darkGrayColor),
                        ),
                      ],
                    ),
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    debugPrint('เข้าสู่ระบบ clicked!');
                    context.goNamed(AppPages.loginName);
                  },
                  child: RichText(
                    text: TextSpan(
                      children: [
                        TextSpan(
                          text: 'มีบัญชีอยู่แล้ว? ',
                          style: Theme.of(context)
                              .textTheme
                              .bodySmall!
                              .copyWith(color: AppColors.darkGrayColor),
                        ),
                        TextSpan(
                          text: 'เข้าสู่ระบบ',
                          style:
                              Theme.of(context).textTheme.bodySmall!.copyWith(
                                    color: AppColors.darkGrayColor,
                                    decoration: TextDecoration.underline,
                                  ),
                        ),
                      ],
                    ),
                  ),
                ),
              ]),
            ),
          ],
        ),
      ),
    );
  }
}
