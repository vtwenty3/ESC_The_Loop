<details>
<summary>Title component</summary>
This component is a reusable title component that accepts props such as `text`, `fontFamily`, and `fontSize`. It displays the text in two layers, one on top of the other, to create a shadow effect, as React Native does not provide a way to create a "sharp" shadow. The first layer is positioned on top and contains white text. The second layer is positioned below and contains black text with a slight offset to create a shadow effect. The component is wrapped in a parent `View` container that centers and justifies its content.
</details>
<details>
<summary>Esc component</summary>
This component is a visual representation of an "ESC" button. It is composed of several `View` layers rectangular layers, and a shadow layer.
When the user presses the button, the button slightly scales down and translates to the right and bottom to give the impression of being pressed. Additionally, the device vibrates briefly using the Vibration API to provide tactile feedback. The component receives a callback function through its `onPress` prop, which is executed when the button is released.
</details>
<details>
<summary>Input component</summary>
This is a custom text input field component. It takes in several props.
Required props: `Value` and `setValue`, `placeholder` text.
Optional props: `multiline` boolean to specify whether the input field is multi-line, `numberOfLines` to specify the number of lines to show in case of a multi-line input field, `fontSize` to specify the size of the font, `numeric` boolean to specify whether the input field should accept only numeric values, `fontFamily` to specify the font family of the text, `pop` boolean to trigger the animation when the input field is focused and `autofocus` boolean to specify whether the input field should be auto-focused.
The component uses the `useState` hook to keep track of the focused state of the input field. It also uses the `useRef` hook to create a reference to the `animatedValue` that is used in the animation of the input field.
When the input field is focused, the `handleFocus` function is called and an animation is triggered to collapse the input field in.
The `handlePressOut` function is called when the `pop` prop is set to true and triggers an animation to "pop" the field, creating a spring release effect. The `useEffect` hook is used to detect the change in the `pop` prop and call the `handlePressOut` function.
</details>
<details>
<summary>Toggle Buttons component</summary>
This is a React Native component that displays two buttons with icons and text, used to toggle between two options: "Task" and "Note". The component takes in two props, `type` and `setType`, which control the currently selected option.
When a button is pressed, the `setType` function is called to update the selected option to either "Task" or "Note". The component uses `useState` hooks to manage the selected state of each button, as well as an `Animated` hook to animate the movement of the selected button.
</details>
<details>
<summary>Button Component</summary>
This component is a customizable button that can be used in React Native applications. The appearance of the button can be customized with different colors, icons, and text. The component provides feedback to the user when the button is pressed, including an animation that makes the button appear to be pressed down and haptic feedback on the press.
</details>
