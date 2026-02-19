import 'package:flutter/material.dart';

class SwitchButton extends StatefulWidget {
  const SwitchButton({super.key});

  @override
  _SwitchButtonState createState() => _SwitchButtonState();
}

class _SwitchButtonState extends State<SwitchButton> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          GestureDetector(
            onTap: () {
              setState(() {
                _selectedIndex = 0;
              });
            },
            child: Column(
              children: [
                Text(
                  'รวม',
                  style: TextStyle(
                    color: _selectedIndex == 0 ? Colors.white : Colors.white70,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 3),
                Container(
                  height: 4,
                  width: 14,
                  color:
                      _selectedIndex == 0 ? Colors.white : Colors.transparent,
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: () {
              setState(() {
                _selectedIndex = 1;
              });
            },
            child: Column(
              children: [
                Text(
                  'ทีมของคุณ',
                  style: TextStyle(
                    color: _selectedIndex == 1 ? Colors.white : Colors.white70,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 3),
                Container(
                  height: 4,
                  width: 14,
                  color:
                      _selectedIndex == 1 ? Colors.white : Colors.transparent,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
