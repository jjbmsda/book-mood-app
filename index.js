import { registerRootComponent } from "expo";
import App from "./App";

registerRootComponent(App);
// 내부에서 AppRegistry.registerComponent('main', () => App) 를 대신 호출해줌..
