import { useState } from 'preact/hooks';
import Header from '../components/ui/Header.js';
import { Page } from '../pages.js';
import { Roll } from '../components/js/gamble/roll.js';
import RollComponent from '../components/ui/Roll.js';

type HomePageProps = {};

export const homePage: Page<HomePageProps> = {
  Component: HomePage,
  title: 'MWA | Home',
};

function HomePage({ }: HomePageProps) {

  return (
    <>
      <Header />

      <RollComponent />
    </>
  );
}
