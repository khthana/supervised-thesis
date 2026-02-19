import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/profile/presentation/bloc/profile_bloc/profile_event.dart';

import '../../../../../config/constants/app_url.dart';
import '../../bloc/profile_bloc/profile_bloc.dart';
import '../../bloc/profile_bloc/profile_state.dart';

class UserInformation extends StatefulWidget {
  final String userID;
  final String userName;
  final int gemAmount;
  final int expAmount;
  final ProfileState state;

  const UserInformation(
      {Key? key,
      required this.userID,
      required this.userName,
      required this.gemAmount,
      required this.expAmount,
      required this.state})
      : super(key: key);

  @override
  _UserInformationState createState() => _UserInformationState();
}

class _UserInformationState extends State<UserInformation> {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ProfileBloc, ProfileState>(
      builder: (context, state) {
        return SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Stack(
                  alignment: Alignment.bottomRight,
                  children: [
                    GestureDetector(
                      onTap: () => _handleImageSelection(context),
                      child: _buildProfileImage(state),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: GestureDetector(
                        onTap: () {
                          context.goNamed(AppPages.editProfileName);
                        },
                        child: Container(
                          decoration: const BoxDecoration(
                            color: AppColors.whiteColor,
                            shape: BoxShape.circle,
                          ),
                          child: SvgPicture.asset(
                            AppImages.editProfileIcon,
                            width: 32,
                            height: 32,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: 24),
                Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.userName,
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          '#${widget.userID}',
                          style:
                              Theme.of(context).textTheme.bodySmall?.copyWith(),
                        ),
                        IconButton(
                          onPressed: () {
                            Clipboard.setData(
                                ClipboardData(text: widget.userID));

                            ScaffoldMessenger.of(context)
                                .showSnackBar(const SnackBar(
                              content: Text(AppStrings.copyToClipboardText),
                              duration: Duration(seconds: 2),
                            ));
                          },
                          icon: SvgPicture.asset(AppImages.copyIcon),
                        )
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 4),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        color: AppColors.whiteColor,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          SvgPicture.asset(
                            AppImages.gemIcon,
                            height: 20,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '${widget.gemAmount}',
                            style: Theme.of(context)
                                .textTheme
                                .bodySmall
                                ?.copyWith(),
                          ),
                          const SizedBox(width: 16),
                          SvgPicture.asset(
                            AppImages.expIcon,
                            height: 20,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '${widget.expAmount}',
                            style: Theme.of(context)
                                .textTheme
                                .bodySmall
                                ?.copyWith(),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

Future<void> _handleImageSelection(BuildContext context) async {
  try {
    // Add image picker functionality here
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 1024,
      maxHeight: 1024,
      imageQuality: 85,
    );

    if (image != null) {
      // Convert XFile to File
      final File imageFile = File(image.path);

      // Dispatch event to update image in bloc
      context.read<ProfileBloc>().add(UpdateProfileImage(imageFile));
    }
  } catch (e) {
    debugPrint('Error selecting image: $e');
    // Show error message to user
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Failed to select image. Please try again.'),
        duration: Duration(seconds: 2),
      ),
    );
  }
}

Widget _buildProfileImage(ProfileState state) {
  Widget profileImage;

  // Helper function to sanitize URL
  String sanitizeImageUrl(String baseUrl, String imagePath) {
    // Remove leading slash if present in imagePath
    final cleanPath =
        imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return '$baseUrl/$cleanPath';
  }

  if (state is ProfileLoaded && state.userProfile.imageUrl.isNotEmpty) {
    // Construct and sanitize the URL
    final imageUrl =
        sanitizeImageUrl(baseUrl, state.userProfile.imageUrl);

    profileImage = ClipOval(
      child: Image.network(
        imageUrl,
        width: 104,
        height: 104,
        fit: BoxFit.cover,
        // Add caching
        cacheWidth: 208, // 2x for high DPI displays
        cacheHeight: 208,
        errorBuilder: (context, error, stackTrace) {
          debugPrint('Error loading image: $error\nURL: $imageUrl');
          return _buildFallbackImage();
        },
        loadingBuilder: (context, child, loadingProgress) {
          if (loadingProgress == null) return child;
          return Container(
            width: 104,
            height: 104,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.grey[200],
            ),
            child: Center(
              child: CircularProgressIndicator(
                value: loadingProgress.expectedTotalBytes != null
                    ? loadingProgress.cumulativeBytesLoaded /
                        loadingProgress.expectedTotalBytes!
                    : null,
              ),
            ),
          );
        },
      ),
    );
  } else if (state.selectedImage != null) {
    profileImage = ClipOval(
      child: Image.file(
        state.selectedImage!,
        width: 104,
        height: 104,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          debugPrint('Error loading local image: $error');
          return _buildFallbackImage();
        },
      ),
    );
  } else {
    profileImage = _buildFallbackImage();
  }

  return Container(
    constraints: const BoxConstraints(
      maxWidth: 104,
      maxHeight: 104,
    ),
    child: profileImage,
  );
}

Widget _buildFallbackImage() {
  return const CircleAvatar(
    radius: 52,
    backgroundImage: AssetImage(AppImages.catImg),
  );
}
