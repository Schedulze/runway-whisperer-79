import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, CustomTooltip } from '@/components/SimpleChart';
import { ThemeToggle } from './ThemeToggle';
import { TrendingUp, Users, DollarSign, Zap, FileText, BarChart3, Target, AlertCircle } from 'lucide-react';

interface FinancialInputs {
  employees: number;
  avgSalary: number;
  marketingSpend: number;
  productPrice: number;
  miscExpenses: number;
  initialCash: number;
  monthlyRevenue: number;
}

interface ChartData {
  month: string;
  cash: number;
  revenue: number;
  expenses: number;
}

const CFODashboard = () => {
  const [inputs, setInputs] = useState<FinancialInputs>({
    employees: 5,
    avgSalary: 8000,
    marketingSpend: 15000,
    productPrice: 99,
    miscExpenses: 5000,
    initialCash: 500000,
    monthlyRevenue: 45000,
  });

  const [baseline] = useState<FinancialInputs>({ ...inputs });
  const [showComparison, setShowComparison] = useState(false);
  const [scenarioCount, setScenarioCount] = useState(3);
  const [reportsGenerated, setReportsGenerated] = useState(1);

  // Calculate financial metrics
  const monthlySalaryCost = inputs.employees * inputs.avgSalary;
  const totalMonthlyExpenses = monthlySalaryCost + inputs.marketingSpend + inputs.miscExpenses;
  const monthlyProfit = inputs.monthlyRevenue - totalMonthlyExpenses;
  const runwayMonths = Math.max(0, Math.floor(inputs.initialCash / Math.max(totalMonthlyExpenses, 1)));

  // Generate chart data
  const generateChartData = (inputData: FinancialInputs): ChartData[] => {
    const data: ChartData[] = [];
    let currentCash = inputData.initialCash;
    const monthlyExp = (inputData.employees * inputData.avgSalary) + inputData.marketingSpend + inputData.miscExpenses;
    
    for (let i = 0; i <= 12; i++) {
      data.push({
        month: `Month ${i}`,
        cash: Math.max(0, currentCash),
        revenue: inputData.monthlyRevenue,
        expenses: monthlyExp,
      });
      currentCash -= (monthlyExp - inputData.monthlyRevenue);
    }
    return data;
  };

  const chartData = generateChartData(inputs);
  const baselineChartData = generateChartData(baseline);

  // Budget allocation data
  const budgetData = [
    { name: 'Salaries', value: monthlySalaryCost, color: '#3B82F6' },
    { name: 'Marketing', value: inputs.marketingSpend, color: '#10B981' },
    { name: 'Misc Expenses', value: inputs.miscExpenses, color: '#F59E0B' },
  ];

  const updateInput = (key: keyof FinancialInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
    setScenarioCount(prev => prev + 1);
  };

  const generateReport = () => {
    setReportsGenerated(prev => prev + 1);
    // In real app, this would trigger report generation
    alert('Report generated! (Frontend demo - backend integration needed)');
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              CFO Helper Agent
            </h1>
            <p className="text-muted-foreground mt-1">Interactive financial scenario planning</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Usage Today</p>
              <div className="flex gap-2">
                <Badge variant="outline">{scenarioCount} scenarios</Badge>
                <Badge variant="outline">{reportsGenerated} reports</Badge>
              </div>
            </div>
            <ThemeToggle />
            <Button onClick={generateReport} className="bg-gradient-primary shadow-button">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Comparison Toggle */}
        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="font-medium">Scenario vs Baseline Comparison</span>
            </div>
            <Switch 
              checked={showComparison} 
              onCheckedChange={setShowComparison}
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Controls */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Financial Levers
            </h2>

            <Card className="p-6 bg-gradient-card shadow-card space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 font-medium">
                    <Users className="h-4 w-4 text-primary" />
                    Employees
                  </label>
                  <span className="text-lg font-bold text-primary">{inputs.employees}</span>
                </div>
                <Slider
                  value={[inputs.employees]}
                  onValueChange={([value]) => updateInput('employees', value)}
                  max={50}
                  min={1}
                  step={1}
                  className="mb-2"
                />
                <p className="text-sm text-muted-foreground">Monthly cost: ${(inputs.employees * inputs.avgSalary).toLocaleString()}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 font-medium">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Avg Salary
                  </label>
                  <span className="text-lg font-bold text-primary">${inputs.avgSalary.toLocaleString()}</span>
                </div>
                <Slider
                  value={[inputs.avgSalary]}
                  onValueChange={([value]) => updateInput('avgSalary', value)}
                  max={20000}
                  min={3000}
                  step={500}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 font-medium">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Marketing Spend
                  </label>
                  <span className="text-lg font-bold text-primary">${inputs.marketingSpend.toLocaleString()}</span>
                </div>
                <Slider
                  value={[inputs.marketingSpend]}
                  onValueChange={([value]) => updateInput('marketingSpend', value)}
                  max={100000}
                  min={0}
                  step={1000}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium">Product Price</label>
                  <span className="text-lg font-bold text-primary">${inputs.productPrice}</span>
                </div>
                <Slider
                  value={[inputs.productPrice]}
                  onValueChange={([value]) => updateInput('productPrice', value)}
                  max={500}
                  min={10}
                  step={5}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium">Misc Expenses</label>
                  <span className="text-lg font-bold text-primary">${inputs.miscExpenses.toLocaleString()}</span>
                </div>
                <Slider
                  value={[inputs.miscExpenses]}
                  onValueChange={([value]) => updateInput('miscExpenses', value)}
                  max={50000}
                  min={0}
                  step={500}
                />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-gradient-card shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Cash Runway</p>
                    <p className="text-2xl font-bold text-foreground">{runwayMonths} months</p>
                  </div>
                  <div className={`p-2 rounded-full ${runwayMonths > 12 ? 'bg-success/20' : runwayMonths > 6 ? 'bg-warning/20' : 'bg-destructive/20'}`}>
                    {runwayMonths > 12 ? (
                      <TrendingUp className="h-5 w-5 text-success" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-warning" />
                    )}
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-card shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Profit</p>
                    <p className={`text-2xl font-bold ${monthlyProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                      ${monthlyProfit.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-2 rounded-full ${monthlyProfit >= 0 ? 'bg-success/20' : 'bg-destructive/20'}`}>
                    <DollarSign className={`h-5 w-5 ${monthlyProfit >= 0 ? 'text-success' : 'text-destructive'}`} />
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-card shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                    <p className="text-2xl font-bold text-foreground">${totalMonthlyExpenses.toLocaleString()}</p>
                  </div>
                  <div className="p-2 rounded-full bg-primary/20">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Cash Runway Chart */}
            <Card className="p-6 bg-gradient-card shadow-chart">
              <h3 className="text-lg font-semibold mb-4">Cash Runway Forecast</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="cash" 
                    data={chartData}
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    name="Current Scenario"
                  />
                  {showComparison && (
                    <Line 
                      type="monotone" 
                      dataKey="cash" 
                      data={baselineChartData}
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Baseline"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Budget Allocation */}
            <Card className="p-6 bg-gradient-card shadow-chart">
              <h3 className="text-lg font-semibold mb-4">Monthly Budget Allocation</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }: any) => `${name} ${Math.round((percent || 0) * 100)}%`}
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CFODashboard;