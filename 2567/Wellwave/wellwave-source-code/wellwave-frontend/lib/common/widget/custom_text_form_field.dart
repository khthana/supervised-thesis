import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';

class CustomTextFormField extends StatefulWidget {
  final String labelText;
  final String hintText;
  final String? suffixText;
  final TextInputType? keyboardType;
  final String? Function(String?)? validator;
  final Function(String)? onChanged;
  final String initialValue;
  final List<TextInputFormatter>? inputFormatters;

  const CustomTextFormField({
    super.key,
    required this.labelText,
    required this.hintText,
    this.suffixText,
    this.keyboardType,
    this.validator,
    this.onChanged,
    this.initialValue = '',
    this.inputFormatters,
  });

  @override
  _CustomTextFormFieldState createState() => _CustomTextFormFieldState();
}

class _CustomTextFormFieldState extends State<CustomTextFormField> {
  final FocusNode _focusNode = FocusNode();
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialValue);
    _focusNode.addListener(() {
      setState(() {});
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      focusNode: _focusNode,
      controller: _controller,
      keyboardType: widget.keyboardType,
      inputFormatters: _getInputFormatters(),
      style: Theme.of(context).textTheme.bodyMedium,
      validator: (value) {
        if (widget.validator != null) {
          return widget.validator!(value);
        }
        return null;
      },
      onChanged: widget.onChanged,
      decoration: InputDecoration(
        labelText: widget.labelText,
        hintText: widget.hintText,
        hintStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppColors.darkGrayColor,
            ),
        floatingLabelBehavior: FloatingLabelBehavior.always,
        suffixText: widget.suffixText,
        labelStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppColors.blueGrayColor,
            ),
        suffixStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppColors.darkGrayColor,
            ),
        enabledBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: AppColors.greyColor),
        ),
        focusedBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: AppColors.primaryColor),
        ),
        filled: true,
        fillColor: AppColors.whiteColor,
        contentPadding: EdgeInsets.zero,
      ),
    );
  }

  List<TextInputFormatter>? _getInputFormatters() {
    List<TextInputFormatter>? formatters = widget.inputFormatters;

    if (widget.keyboardType == TextInputType.number) {
      formatters = (formatters ?? [])
        ..add(FilteringTextInputFormatter.digitsOnly);
    }

    return formatters;
  }
}

class CustomTextFormFieldLarge extends StatefulWidget {
  final String? labelText;
  final String hintText;
  final String? suffixText;
  final TextInputType? keyboardType;
  final String? Function(String?)? validator;
  final Function(String)? onChanged;
  final String initialValue;
  final List<TextInputFormatter>? inputFormatters;
  final TextEditingController? controller;

  const CustomTextFormFieldLarge({
    super.key,
    this.labelText,
    required this.hintText,
    this.suffixText,
    this.keyboardType,
    this.validator,
    this.onChanged,
    this.initialValue = '',
    this.inputFormatters,
    this.controller,
  });

  @override
  _CustomTextFormFieldLargeState createState() =>
      _CustomTextFormFieldLargeState();
}

class _CustomTextFormFieldLargeState extends State<CustomTextFormFieldLarge> {
  final FocusNode _focusNode = FocusNode();
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller =
        widget.controller ?? TextEditingController(text: widget.initialValue);
    _focusNode.addListener(() {
      setState(() {});
    });
  }

  @override
  void dispose() {
    if (widget.controller == null) {
      _controller.dispose();
    }
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      focusNode: _focusNode,
      controller: _controller,
      keyboardType: widget.keyboardType,
      inputFormatters: _getInputFormatters(),
      style: Theme.of(context).textTheme.titleXL,
      validator: widget.validator,
      onChanged: (value) {
        widget.onChanged?.call(value);
      },
      decoration: InputDecoration(
        labelText: widget.labelText,
        hintText: widget.hintText,
        hintStyle: Theme.of(context).textTheme.titleLarge?.copyWith(
              color: AppColors.darkGrayColor,
            ),
        floatingLabelBehavior: FloatingLabelBehavior.always,
        suffixText: widget.suffixText,
        labelStyle: Theme.of(context).textTheme.titleLarge?.copyWith(
              color: AppColors.blueGrayColor,
            ),
        suffixStyle: Theme.of(context).textTheme.titleLarge?.copyWith(
              color: AppColors.darkGrayColor,
            ),
        enabledBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: AppColors.greyColor),
        ),
        focusedBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: AppColors.primaryColor),
        ),
        filled: true,
        fillColor: AppColors.transparentColor,
        contentPadding: EdgeInsets.zero,
      ),
    );
  }

  List<TextInputFormatter>? _getInputFormatters() {
    List<TextInputFormatter>? formatters = widget.inputFormatters;

    if (widget.keyboardType == TextInputType.number) {
      formatters = (formatters ?? [])
        ..add(FilteringTextInputFormatter.digitsOnly);
    }

    return formatters;
  }
}

class CustomTextFormFieldMD extends StatefulWidget {
  final String? labelText;
  final String hintText;
  final String? suffixText;
  final TextInputType? keyboardType;
  final String? Function(String?)? validator;
  final Function(String)? onChanged;
  final String initialValue;
  final List<TextInputFormatter>? inputFormatters;
  final TextEditingController? controller;

  const CustomTextFormFieldMD({
    super.key,
    this.labelText,
    required this.hintText,
    this.suffixText,
    this.keyboardType,
    this.validator,
    this.onChanged,
    this.initialValue = '',
    this.inputFormatters,
    this.controller,
  });

  @override
  _CustomTextFormFieldMDState createState() => _CustomTextFormFieldMDState();
}

class _CustomTextFormFieldMDState extends State<CustomTextFormFieldMD> {
  final FocusNode _focusNode = FocusNode();
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller =
        widget.controller ?? TextEditingController(text: widget.initialValue);
    _focusNode.addListener(() {
      setState(() {});
    });
  }

  @override
  void dispose() {
    if (widget.controller == null) {
      _controller.dispose();
    }
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      focusNode: _focusNode,
      controller: _controller,
      keyboardType: widget.keyboardType,
      inputFormatters: _getInputFormatters(),
      style: Theme.of(context).textTheme.labelLarge,
      validator: widget.validator,
      onChanged: (value) {
        widget.onChanged?.call(value);
      },
      decoration: InputDecoration(
        labelText: widget.labelText,
        hintText: widget.hintText,
        hintStyle: Theme.of(context).textTheme.labelLarge?.copyWith(
              color: AppColors.greyColor,
            ),
        floatingLabelBehavior: FloatingLabelBehavior.always,
        suffixText: widget.suffixText,
        labelStyle: Theme.of(context).textTheme.labelLarge?.copyWith(
              color: AppColors.blueGrayColor,
            ),
        suffixStyle: Theme.of(context).textTheme.headlineLarge?.copyWith(
              color: AppColors.darkGrayColor,
            ),
        enabledBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: AppColors.greyColor),
        ),
        focusedBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: AppColors.primaryColor),
        ),
        filled: false,
        contentPadding: EdgeInsets.zero,
      ),
    );
  }

  List<TextInputFormatter>? _getInputFormatters() {
    List<TextInputFormatter>? formatters = widget.inputFormatters;

    if (widget.keyboardType == TextInputType.number) {
      formatters = (formatters ?? [])
        ..add(FilteringTextInputFormatter.digitsOnly);
    }

    return formatters;
  }
}
