import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class CoinDisplay extends StatelessWidget {
  final String icon;
  final String pointText;

  const CoinDisplay({
    Key? key,
    required this.pointText,
    required this.icon,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      alignment: Alignment.centerLeft,
      children: [
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16.0),
          ),
          padding: const EdgeInsets.only(
              left: 32.0, right: 16.0, top: 4.0, bottom: 4.0),
          margin: const EdgeInsets.only(left: 8.0),
          child: ConstrainedBox(
            constraints: const BoxConstraints(
              minWidth: 36.0,
            ),
            child: Text(
              pointText,
              style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    color: Colors.black,
                  ),
              textAlign: TextAlign.right,
            ),
          ),
        ),
        Positioned(
          left: 0,
          child: SvgPicture.asset(
            icon,
            height: 36.0,
          ),
        ),
      ],
    );
  }
}
