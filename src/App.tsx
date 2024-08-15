import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import { Show, createSignal } from 'solid-js';
import type { JSX } from 'solid-js';

const readURL = (file: File) => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => res(e.target?.result);
    reader.onerror = (e) => rej(e);
    reader.readAsDataURL(file);
  });
};

const average = (array: number[]) =>
  array.reduce((a, b) => a + b) / array.length;

const App: Component = () => {
  const [timeTook, setTimeTook] = createSignal(0);
  const [loading, setLoading] = createSignal(false)

  const onChangeInput: JSX.EventHandler<HTMLInputElement, InputEvent> = async (
    evt
  ) => {
    setLoading(true)
    const file = evt.currentTarget.files?.[0];
    if (!file) {
      return;
    }
    const newSrc = (await readURL(file)) as string;

    const times = await Promise.all(
      new Array(1000).fill(newSrc).map(async () => {
        const img = new Image();
        img.src = newSrc;
        const time = Date.now();
        await img.decode();
        return Date.now() - time;
      })
    );

    setTimeTook(average(times));
    setLoading(false)
  };
  return (
    <div class={styles.App}>
      <Show when={!loading()} fallback={<p>Loading...</p>}>
        <p>Average time took to load 1000 images: {timeTook()}ms</p>
      </Show>
      <input type="file" onInput={onChangeInput} />
    </div>
  );
};

export default App;
