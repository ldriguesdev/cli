import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';

export const showBanner = () => {
  console.clear();
  const text = figlet.textSync('DOPSTER CLI', {
    horizontalLayout: 'default',
    verticalLayout: 'default',
  });
  console.log(gradient.pastel.multiline(text));
  console.log(chalk.cyanBright('Welcome to Dopster CLI!'));
};