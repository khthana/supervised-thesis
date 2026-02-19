import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path/path.dart' as path;
import '../../../../../config/constants/app_images.dart';
import '../../../../../config/constants/app_url.dart';
import '../../bloc/profile_bloc/profile_bloc.dart';
import '../../bloc/profile_bloc/profile_event.dart';
import '../../bloc/profile_bloc/profile_state.dart';

class EditProfileImage extends StatefulWidget {
  final ProfileState state;

  const EditProfileImage({super.key, required this.state});

  @override
  State<EditProfileImage> createState() => _EditProfileImageState();
}

class _EditProfileImageState extends State<EditProfileImage> {
  bool _isPickingImage = false;
  final ImagePicker _picker = ImagePicker();

  @override
  void dispose() {
    _isPickingImage = false;
    super.dispose();
  }

  Future<void> _pickImage() async {
    if (_isPickingImage) return;

    if (!mounted) return;

    setState(() {
      _isPickingImage = true;
    });

    try {
      final XFile? pickedFile = await _picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 85,
      );

      if (!mounted) return;

      if (pickedFile != null) {
        final extension = path.extension(pickedFile.path).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif'].contains(extension)) {
          final file = File(pickedFile.path);
          if (await file.exists()) {
            if (!mounted) return;
            context.read<ProfileBloc>().add(ImagePicked(file));
          }
        } else {
          if (!mounted) return;
          _showSnackBar('Please select a JPG, PNG, or GIF image');
        }
      }
    } catch (e) {
      if (!mounted) return;
      _showSnackBar('Error selecting image. Please try again.');
    } finally {
      if (mounted) {
        setState(() {
          _isPickingImage = false;
        });
      }
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  Widget _buildProfileImage(ProfileState state) {
    if (state is ProfileLoaded) {
      if (state.selectedImage != null && state.selectedImage!.existsSync()) {
        return _buildImageWidget(
          type: ImageType.file,
          source: state.selectedImage!,
        );
      } else if (state.userProfile.imageUrl.isNotEmpty) {
        return _buildImageWidget(
          type: ImageType.network,
          source: "$baseUrl${state.userProfile.imageUrl}",
        );
      }
    }
    return _buildDefaultImage();
  }

  Widget _buildImageWidget({
    required ImageType type,
    required dynamic source,
  }) {
    return ClipOval(
      child: SizedBox(
        width: 128,
        height: 128,
        child: type == ImageType.file
            ? Image.file(
                source as File,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => _buildDefaultImage(),
              )
            : Image.network(
                source as String,
                fit: BoxFit.cover,
                loadingBuilder: (_, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return const Center(
                    child: CircularProgressIndicator(),
                  );
                },
                errorBuilder: (_, __, ___) => _buildDefaultImage(),
              ),
      ),
    );
  }

  Widget _buildDefaultImage() {
    return const CircleAvatar(
      radius: 64,
      backgroundImage: AssetImage(AppImages.catImg),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<ProfileBloc, ProfileState>(
      listener: (context, state) {
        if (state is ProfileError) {
          _showSnackBar(state.errorMessage);
        }
      },
      builder: (context, state) {
        return Stack(
          alignment: Alignment.bottomCenter,
          children: [
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: state is ProfileLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _buildProfileImage(state),
            ),
            if (!_isPickingImage)
              Positioned(
                child: GestureDetector(
                  onTap: _pickImage,
                  child: SvgPicture.asset(AppImages.editUserProfileSvg),
                ),
              ),
          ],
        );
      },
    );
  }
}

enum ImageType {
  file,
  network,
}
