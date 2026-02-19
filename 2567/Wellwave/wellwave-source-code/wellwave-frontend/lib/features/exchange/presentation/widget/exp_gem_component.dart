import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class ExpGemComponent extends StatelessWidget {
  final String imagePath;
  final int value;

  const ExpGemComponent({
    Key? key,
    required this.imagePath,
    required this.value,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Container(
          width: 77,
          height: 24,
          decoration: BoxDecoration(
            color: const Color(0xFFFEF7E6),
            borderRadius: BorderRadius.circular(16),
            boxShadow: const [
              BoxShadow(
                color: Color.fromRGBO(16, 24, 40, 0.1),
                offset: Offset(0, 1),
                blurRadius: 3,
              ),
              BoxShadow(
                color: Color.fromRGBO(16, 24, 40, 0.06),
                offset: Offset(0, 1),
                blurRadius: 2,
              ),
            ],
          ),
          child: Center(
            child: Text(
              value.toString(),
              style: Theme.of(context)
                  .textTheme
                  .bodySmall
                  ?.copyWith(fontWeight: FontWeight.w600),
            ),
          ),
        ),
        Positioned(
          top: -4,
          left: -10,
          child: SvgPicture.asset(
            imagePath,
            height: 32,
          ),
        ),
      ],
    );
  }
}
