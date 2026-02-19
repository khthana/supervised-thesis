import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:image_picker/image_picker.dart';
import 'package:wellwave_frontend/common/widget/custom_text_form_field.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/start_health_step.dart';

import '../../presentation/bloc/health_assessment_page/health_assessment_page_bloc.dart';
import '../../presentation/bloc/health_assessment_page/health_assessment_page_event.dart';
import '../../presentation/bloc/health_assessment_page/health_assessment_page_state.dart';

class AddPicUsernameStep extends StatefulWidget {
  const AddPicUsernameStep({super.key});

  @override
  State<AddPicUsernameStep> createState() => _AddPicUsernameStepState();
}

class _AddPicUsernameStepState extends State<AddPicUsernameStep> {
  final ImagePicker _picker = ImagePicker();
  File? _temporaryImageFile;
  Future<void> _pickImage() async {
    try {
      final XFile? pickedFile = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 800,
        maxHeight: 800,
        imageQuality: 85,
      );

      if (pickedFile != null) {
        setState(() {
          _temporaryImageFile = File(pickedFile.path);
        });
        debugPrint('Selected image path: ${_temporaryImageFile?.path}');
      }
    } catch (e) {
      debugPrint('Error picking image: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('เกิดข้อผิดพลาด: ${e.toString()}')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<HealthAssessmentPageBloc>().state;

    if (state.showStartStep) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const StartHealthStep()),
        );
      });
    }

    return SingleChildScrollView(
      child: Column(
        children: <Widget>[
          Text(
            AppStrings.setNameandPicText,
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          Text(
            AppStrings.callNameAskText,
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const SizedBox(height: 64),
          Stack(
            alignment: Alignment.center,
            children: [
              _buildProfileImage(state),
              _buildCameraButton(),
            ],
          ),
          const SizedBox(height: 48),
          CustomTextFormField(
            labelText: "ชื่อผู้ใช้*",
            hintText: AppStrings.usernameText,
            initialValue: state.formData['username'] ?? '',
            inputFormatters: [
              LengthLimitingTextInputFormatter(16),
            ],
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'กรุณากรอกชื่อผู้ใช้';
              }
              return null;
            },
            onChanged: (value) => context
                .read<HealthAssessmentPageBloc>()
                .add(UpdateField('username', value)),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileImage(HealthAssessmentPageState state) {
    final imageToShow = _temporaryImageFile ?? state.selectedImage;

    return Container(
      width: 176,
      height: 176,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.grey[200],
      ),
      child: ClipOval(
        child: imageToShow != null
            ? Image.file(
                imageToShow,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return _buildFallbackImage();
                },
              )
            : _buildFallbackImage(),
      ),
    );
  }

  Widget _buildCameraButton() {
    return Positioned(
      bottom: 0,
      right: 0,
      child: ElevatedButton(
        onPressed: _pickImage,
        style: ElevatedButton.styleFrom(
          shape: const CircleBorder(),
          padding: const EdgeInsets.all(12),
          backgroundColor: Theme.of(context).primaryColor,
        ),
        child: SvgPicture.asset(
          AppImages.cameraIcon,
          colorFilter: ColorFilter.mode(
            Theme.of(context).colorScheme.onPrimary,
            BlendMode.srcIn,
          ),
        ),
      ),
    );
  }

  Widget _buildFallbackImage() {
    return SvgPicture.asset(
      AppImages.avatarDefaultIcon,
      fit: BoxFit.cover,
    );
  }
}
