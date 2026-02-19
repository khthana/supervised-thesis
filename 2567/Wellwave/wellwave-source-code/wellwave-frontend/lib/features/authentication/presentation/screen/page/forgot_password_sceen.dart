import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/authentication/presentation/bloc/auth_bloc.dart';

class ForgotPasswordScreen extends StatelessWidget {
  final TextEditingController _emailController = TextEditingController();

  ForgotPasswordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.backgroundColor,
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back,
            color: AppColors.blackColor,
          ),
          onPressed: () {
            // Navigator.pop(context);
            BlocProvider.of<AuthBloc>(context).add(GoBackEvent());
          },
        ),
      ),
      body: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, state) {
          if (state is RequestResetState) {
            return _buildRequestResetUI(context);
          } else if (state is ConfirmCodeState) {
            return _buildConfirmCodeUI(context);
          } else if (state is ResetPasswordState) {
            return _buildResetPasswordUI(context);
          }
          return Container();
        },
      ),
    );
  }

  Widget _buildRequestResetUI(BuildContext context) {
    return Container(
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
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('ลืมรหัสผ่าน',
                    style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 16),
                Text(
                    'ลืมรหัสผ่านใช่ไหม? ไม่เป็นไร!\nกรอกอีเมลที่คุณใช้สมัครได้เลย',
                    style: Theme.of(context)
                        .textTheme
                        .bodyMedium!
                        .copyWith(color: AppColors.darkGrayColor)),
                const SizedBox(height: 36),
                TextField(
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
                const SizedBox(height: 32),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    foregroundColor: AppColors.whiteColor,
                    backgroundColor: AppColors.primaryColor,
                    minimumSize: const Size(350, 60),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16.0),
                    ),
                  ),
                  onPressed: () {
                    if (_emailController.text.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('กรุณากรอกข้อมูลให้ครบถ้วน'),
                          backgroundColor: Colors.red,
                        ),
                      );
                    } else {
                      debugPrint('next');
                      BlocProvider.of<AuthBloc>(context)
                          .add(ConfirmCodeEvent());
                    }
                  },
                  child: Text(
                    AppStrings.nextText,
                    style: Theme.of(context)
                        .textTheme
                        .bodyMedium!
                        .copyWith(color: AppColors.whiteColor),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildConfirmCodeUI(BuildContext context) {
    return Container(
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
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('ยืนยันรหัสจากอีเมล',
                    style: Theme.of(context).textTheme.titleLarge
                    // style: Theme.of(context).textTheme.titleLarge)
                    ),
                const SizedBox(height: 16),
                Text(
                  'เราได้ส่งรหัสกู้คืนไปที่อีเมลของคุณแล้ว\nกรอกรหัสที่ได้รับเพื่อดำเนินการต่อ',
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium!
                      .copyWith(color: AppColors.darkGrayColor),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 64),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: List.generate(4, (index) {
                    return const SizedBox(
                      width: 72,
                      child: TextField(
                        textAlign: TextAlign.center,
                        decoration: InputDecoration(
                          border: OutlineInputBorder(
                              borderRadius:
                                  BorderRadius.all(Radius.circular(16))),
                        ),
                      ),
                    );
                  }),
                ),
                const SizedBox(
                  height: 32,
                ),
                GestureDetector(
                  onTap: () {
                    debugPrint('forget password!!');
                    context.goNamed(AppPages.forgetPasswordName);
                  },
                  child: Text(
                    'ส่งอีกครั้ง',
                    style: Theme.of(context).textTheme.bodySmall!.copyWith(
                          color: AppColors.darkGrayColor,
                          decoration: TextDecoration.underline,
                        ),
                  ),
                ),
                const SizedBox(height: 64),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    foregroundColor: AppColors.whiteColor,
                    backgroundColor: AppColors.primaryColor,
                    minimumSize: const Size(350, 60),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16.0),
                    ),
                  ),
                  onPressed: () {
                    // if (_emailController.text.isEmpty) {
                    //   ScaffoldMessenger.of(context).showSnackBar(
                    //     SnackBar(
                    //       content: Text('กรุณากรอกข้อมูลให้ครบถ้วน'),
                    //       backgroundColor: Colors.red,
                    //     ),
                    //   );
                    // } else {
                    debugPrint('next');
                    BlocProvider.of<AuthBloc>(context)
                        .add(ResetPasswordEvent());

                    context.goNamed(AppPages.homeName);
                    // }
                  },
                  child: Text(
                    AppStrings.nextText,
                    style: Theme.of(context)
                        .textTheme
                        .bodyMedium!
                        .copyWith(color: AppColors.whiteColor),
                  ),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResetPasswordUI(BuildContext context) {
    return Container(
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
            padding: const EdgeInsets.only(top: 164, left: 24.0, right: 24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Text(
                  'ตั้งรหัสผ่านใหม่',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 16),
                const Text('สร้างรหัสผ่านใหม่สำหรับบัญชีของคุณกันเถอะ'),
                const SizedBox(height: 46),
                TextField(
                  controller: _emailController,
                  style: Theme.of(context).textTheme.bodySmall,
                  decoration: InputDecoration(
                    labelText: 'รหัสผ่าน',
                    labelStyle: Theme.of(context).textTheme.bodySmall,
                    contentPadding:
                        const EdgeInsets.only(left: 20, top: 7, bottom: 7),
                    hintStyle: Theme.of(context).textTheme.bodySmall,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _emailController,
                  style: Theme.of(context).textTheme.bodySmall,
                  decoration: InputDecoration(
                    labelText: 'ยืนยันรหัสผ่าน',
                    labelStyle: Theme.of(context).textTheme.bodySmall,
                    contentPadding:
                        const EdgeInsets.only(left: 20, top: 7, bottom: 7),
                    hintStyle: Theme.of(context).textTheme.bodySmall,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    foregroundColor: AppColors.whiteColor,
                    backgroundColor: AppColors.primaryColor,
                    minimumSize: const Size(350, 60),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16.0),
                    ),
                  ),
                  onPressed: () {
                    if (_emailController.text.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('กรุณากรอกข้อมูลให้ครบถ้วน'),
                          backgroundColor: Colors.red,
                        ),
                      );
                    } else {
                      debugPrint('next');
                      BlocProvider.of<AuthBloc>(context)
                          .add(ConfirmCodeEvent());
                    }
                  },
                  child: Text(
                    AppStrings.confirmText,
                    style: Theme.of(context)
                        .textTheme
                        .bodyMedium!
                        .copyWith(color: AppColors.whiteColor),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
