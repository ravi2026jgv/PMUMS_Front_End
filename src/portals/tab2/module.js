import Tab2Home from './pages/Home';
import Tab2About from './pages/About';
import Tab2Niyamawali from './pages/Niyamawali';
import Tab2Register from './pages/Register';
import Tab2Profile from './pages/Profile';
import Tab2Footer from './components/Footer';

const tab2Module = {
  pages: {
    home: Tab2Home,
    about: Tab2About,
    niyamawali: Tab2Niyamawali,
    register: Tab2Register,
    profile: Tab2Profile,
  },

  components: {
    footer: Tab2Footer,
  },
};

export default tab2Module;
