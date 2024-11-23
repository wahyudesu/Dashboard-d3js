import { useState, useEffect } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { SalesChart } from './components/SalesChart';
import { ProductPieChart } from './components/ProductPieChart';
import { BarChart, LineChart, TrendingUp, PackageSearch } from 'lucide-react';
import dashboardData from './data/dashboard.json';
import NumberTicker from './components/ui/number-ticker';
import { DownloadButton } from './components/Download';
import { GrowthChart } from './components/growth';
import { BranchMap } from './components/maps';
import { AccountButton } from './components/account';
import GradualSpacing from './components/ui/gradual-spacing';
import HyperText from './components/ui/hyper-text';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    // Hide intro after 2 seconds
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const totalRevenue = dashboardData.salesData.monthly.revenue.reduce((a, b) => a + b, 0);
  const totalSales = dashboardData.salesData.monthly.sales.reduce((a, b) => a + b, 0);
  const totalProfit = dashboardData.salesData.monthly.profit.reduce((a, b) => a + b, 0);
  const totalProduct = Object.keys(dashboardData.productData.details).length;

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Intro Screen */}
      <div className={`fixed inset-0 bg-blue-600 dark:bg-blue-800 z-50 flex items-center justify-center transition-transform duration-700 ${
        showIntro ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="text-center">
          <GradualSpacing className="font-display text-center text-4xl font-bold -tracking-wider text-white md:text-7xl md:leading-[5rem]"
            text= "Project Bagus bagusan dashboard"
          />
          <p className="mt-10 text-3xl text-blue-100 animate-fade-in-delay">
            Wahyu Ikbal Maulana
          </p>
          <p className="mt-4 text-2xl text-blue-100 animate-fade-in-delay">
            3323600056
          </p>
          <p className="mt-4 text-2xl text-blue-100 animate-fade-in-delay">
            D4 Sains Data Terapan B
          </p>
        </div>

      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <HyperText className="text-3xl font-bold text-black dark:text-white" text='Sales Dashboard'/>
          <div className="flex items-center gap-4">
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
            <DownloadButton/>
            <AccountButton/>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                $ <NumberTicker value={totalRevenue} />
                </p>
              </div>
              <LineChart className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <NumberTicker value={totalSales} /> units
                </p>
              </div>
              <BarChart className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Profit</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  $ <NumberTicker value={totalProfit} />
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Product</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <NumberTicker value={totalProduct} />
                </p>
              </div>
              <PackageSearch className="w-8 h-8 text-sky-400" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:ring">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Monthly Performance</h2>
            <SalesChart data={dashboardData.salesData} isDark={isDark} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:ring">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Product Distribution</h2>
            <ProductPieChart data={dashboardData.productData} isDark={isDark} />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 ">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:ring">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Product Growth</h2>
            <GrowthChart data={dashboardData.productData} isDark={isDark} />
          </div>
          {/* Product Details Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:ring">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Product Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Units Sold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Average Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Growth
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {dashboardData.productData.labels.map((product, index) => (
                    <tr 
                      key={product}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {dashboardData.productData.details[product].units_sold}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ${dashboardData.productData.details[product].avg_price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full ${
                          dashboardData.productData.growth[index] > 20
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                            : dashboardData.productData.growth[index] > 10
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                        }`}>
                          {dashboardData.productData.growth[index]}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:ring">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Lokasi</h2>
            <BranchMap data={dashboardData.branchData} isDark={isDark} />
          </div>
        </div>
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Wahyu Ikbal Maulana</h2>
          <h2 className="text-xl font-semibold dark:text-white mb-4">3323600056</h2>
          <h2 className="text-xl font-semibold dark:text-white">Dosen pengampu:</h2>
          <h2 className="text-xl font-semibold dark:text-white mb-4">Pak Edi</h2>
          <h2 className="text-xl font-semibold dark:text-white">Teknologi yang digunakan:</h2>
          <h2 className="text-xl font-semibold dark:text-white">Vite + React + Ts + Tailwind CSS + Magic UI + Leaflet js + D3.js</h2>
        </div>
      </div>
    </div>
  );
}

export default App;
