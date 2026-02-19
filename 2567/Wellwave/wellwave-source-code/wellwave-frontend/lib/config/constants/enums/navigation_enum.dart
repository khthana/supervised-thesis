import '../app_pages.dart';

enum NavigationPage {
  home(AppPages.homeName),
  todoList(AppPages.logName),
  mission(AppPages.missionName),
  friend(AppPages.friendName),
  article(AppPages.articleName);
  final String name;
  const NavigationPage(this.name);
}
