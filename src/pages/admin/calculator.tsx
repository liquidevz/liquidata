import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ModernAdminLayout } from '../../components/admin/ModernAdminLayout';
import { HelpTooltip } from '../../components/admin/HelpTooltip';
import { InfoCard } from '../../components/admin/InfoCard';
import { FiSave, FiRefreshCw, FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiAlertCircle, FiCode, FiTarget, FiLayers, FiDollarSign } from 'react-icons/fi';
import { isAuthenticated, adminFetch, publicFetch } from '../../utils/adminApi';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalculatorManagement() {
  const router = useRouter();
  const [calculator, setCalculator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'steps' | 'pricing' | 'rules'>('steps');
  const [editingStep, setEditingStep] = useState<any>(null);
  const [showStepModal, setShowStepModal] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    loadCalculator();
  }, [mounted, router]);

  const loadCalculator = async () => {
    try {
      const data = await publicFetch('/api/calculator');
      setCalculator(data);
    } catch (error) {
      showMessage('error', 'Failed to load calculator configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      await adminFetch('/api/admin/calculator', {
        method: 'PUT',
        body: JSON.stringify(calculator),
      });

      showMessage('success', 'Calculator configuration saved successfully!');
      loadCalculator();
    } catch (error: any) {
      showMessage('error', error.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSeedCalculator = async () => {
    if (!confirm('This will reset the calculator configuration to default. Continue?')) {
      return;
    }

    setSeeding(true);
    setMessage(null);

    try {
      const result = await adminFetch('/api/admin/seed-calculator', {
        method: 'POST'
      });

      showMessage('success', `${result.message} (${result.stepCount} steps)`);
      loadCalculator();
    } catch (error: any) {
      showMessage('error', error.message || 'Failed to seed calculator');
    } finally {
      setSeeding(false);
    }
  };

  const updatePricingConfig = (field: string, value: any) => {
    setCalculator({
      ...calculator,
      pricingConfig: {
        ...calculator.pricingConfig,
        [field]: value
      }
    });
  };

  const updatePricingRule = (category: string, key: string, value: number) => {
    setCalculator({
      ...calculator,
      pricingRules: {
        ...calculator.pricingRules,
        [category]: {
          ...calculator.pricingRules?.[category],
          [key]: value
        }
      }
    });
  };

  const addStep = () => {
    setEditingStep({
      id: `step-${Date.now()}`,
      title: '',
      subtitle: '',
      type: 'single-select',
      required: false,
      order: (calculator?.steps?.length || 0) + 1,
      options: []
    });
    setShowStepModal(true);
  };

  const editStep = (step: any) => {
    setEditingStep({ ...step });
    setShowStepModal(true);
  };

  const deleteStep = (stepId: string) => {
    if (confirm('Are you sure you want to delete this step? This action cannot be undone.')) {
      setCalculator({
        ...calculator,
        steps: calculator.steps.filter((s: any) => s.id !== stepId)
      });
      showMessage('success', 'Step deleted. Remember to save your changes!');
    }
  };

  const saveStep = () => {
    if (!editingStep.title) {
      alert('Please enter a step title');
      return;
    }

    const existingIndex = calculator.steps?.findIndex((s: any) => s.id === editingStep.id);
    
    if (existingIndex >= 0) {
      const updatedSteps = [...calculator.steps];
      updatedSteps[existingIndex] = editingStep;
      setCalculator({ ...calculator, steps: updatedSteps });
    } else {
      setCalculator({
        ...calculator,
        steps: [...(calculator.steps || []), editingStep]
      });
    }

    setShowStepModal(false);
    setEditingStep(null);
    showMessage('success', 'Step updated! Don\'t forget to save your changes.');
  };

  const addOptionToStep = () => {
    setEditingStep({
      ...editingStep,
      options: [
        ...(editingStep.options || []),
        {
          key: `option-${Date.now()}`,
          title: '',
          description: '',
          multiplier: 1,
          addCost: 0,
          isPopular: false
        }
      ]
    });
  };

  const updateStepOption = (index: number, field: string, value: any) => {
    const updatedOptions = [...editingStep.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setEditingStep({ ...editingStep, options: updatedOptions });
  };

  const deleteStepOption = (index: number) => {
    setEditingStep({
      ...editingStep,
      options: editingStep.options.filter((_: any, i: number) => i !== index)
    });
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 uppercase tracking-wider text-sm">Loading calculator...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Calculator Management - Admin</title>
      </Head>
      <ModernAdminLayout activeTab="CALCULATOR">
        <div className="max-w-7xl mx-auto">
          {/* Header with explanation */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">Configuration Center</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Calculator Management</h1>
                <p className="text-gray-400 text-lg">Complete control over your pricing calculator's behavior and appearance</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={loadCalculator}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1e1f26] text-gray-300 rounded-lg hover:bg-[#252630] hover:text-cyan-400 transition-all border border-[#252630]"
                >
                  <FiRefreshCw size={18} />
                  <span className="font-medium">Refresh</span>
                </button>
                <button
                  onClick={handleSeedCalculator}
                  disabled={seeding}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all border border-green-500/30 font-semibold disabled:opacity-50"
                >
                  <FiRefreshCw size={18} className={seeding ? 'animate-spin' : ''} />
                  <span>{seeding ? 'Seeding...' : 'Seed Default'}</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/50 font-semibold uppercase tracking-wider disabled:opacity-50"
                >
                  <FiSave size={18} />
                  <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
                </button>
              </div>
            </div>

            {/* Info Card */}
            <InfoCard type="tip" title="How it works">
              This calculator uses a <strong>conditional step system</strong> where steps appear based on user selections. 
              Configure each step, set pricing rules, and the calculator will automatically guide users through the perfect flow for their project.
            </InfoCard>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
                message.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {message.type === 'success' ? <FiCheck size={20} /> : <FiAlertCircle size={20} />}
              {message.text}
            </motion.div>
          )}

          {/* Tabs with icons and descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { 
                id: 'steps', 
                label: 'Calculator Steps', 
                icon: FiLayers,
                count: calculator?.steps?.length || 0,
                description: 'Build your calculator flow'
              },
              { 
                id: 'pricing', 
                label: 'Pricing Config', 
                icon: FiDollarSign,
                count: null,
                description: 'Set base pricing rules'
              },
              { 
                id: 'rules', 
                label: 'Pricing Rules', 
                icon: FiTarget,
                count: null,
                description: 'Fine-tune cost calculations'
              }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`p-6 rounded-lg font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                      : 'bg-[#1e1f26] text-gray-400 hover:text-white hover:bg-[#252630] border border-[#252630]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon size={24} />
                    {tab.count !== null && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isActive ? 'bg-white/20' : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </div>
                  <div className="uppercase tracking-wider text-sm mb-1">{tab.label}</div>
                  <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                    {tab.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'steps' && (
              <motion.div
                key="steps"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Steps Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Calculator Steps</h2>
                    <p className="text-gray-400">Each step guides users through their project requirements</p>
                  </div>
                  <button
                    onClick={addStep}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 border border-green-400/30 font-semibold shadow-lg shadow-green-500/30"
                  >
                    <FiPlus size={20} />
                    Add New Step
                  </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-5 bg-gradient-to-br from-[#1e1f26] to-[#13141a] rounded-lg border border-cyan-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Steps</span>
                      <HelpTooltip content="Total number of steps configured in your calculator. Users may see fewer based on their selections." />
                    </div>
                    <p className="text-3xl font-bold text-cyan-400">{calculator?.steps?.length || 0}</p>
                  </div>
                  
                  <div className="p-5 bg-gradient-to-br from-[#1e1f26] to-[#13141a] rounded-lg border border-green-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Always Visible</span>
                      <HelpTooltip content="Steps that appear for every user, regardless of their selections." />
                    </div>
                    <p className="text-3xl font-bold text-green-400">
                      {calculator?.steps?.filter((s: any) => !s.condition).length || 0}
                    </p>
                  </div>
                  
                  <div className="p-5 bg-gradient-to-br from-[#1e1f26] to-[#13141a] rounded-lg border border-orange-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-orange-400 uppercase tracking-wider font-semibold">Conditional</span>
                      <HelpTooltip content="Steps that only appear when specific conditions are met (e.g., project type = mobile-app)." />
                    </div>
                    <p className="text-3xl font-bold text-orange-400">
                      {calculator?.steps?.filter((s: any) => s.condition).length || 0}
                    </p>
                  </div>
                  
                  <div className="p-5 bg-gradient-to-br from-[#1e1f26] to-[#13141a] rounded-lg border border-red-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Required</span>
                      <HelpTooltip content="Steps users must complete before moving forward." />
                    </div>
                    <p className="text-3xl font-bold text-red-400">
                      {calculator?.steps?.filter((s: any) => s.required).length || 0}
                    </p>
                  </div>
                </div>

                {/* Explanation Card */}
                <InfoCard type="warning" title="Understanding Conditional Steps">
                  Conditional steps are <strong>highlighted in orange</strong>. They only appear when their condition is satisfied. 
                  For example, a "Mobile App Features" step might only show if the user selects "Mobile App" as their project type.
                </InfoCard>

                {/* Steps List */}
                <div className="space-y-4">
                  {calculator?.steps?.map((step: any, index: number) => {
                    const hasCondition = step.condition && step.condition !== '';
                    let conditionText = '';
                    
                    if (hasCondition) {
                      try {
                        const cond = typeof step.condition === 'string' ? JSON.parse(step.condition) : step.condition;
                        conditionText = `Shows when ${cond.field} ${cond.type} "${cond.value}"`;
                      } catch (e) {
                        conditionText = 'Has custom condition';
                      }
                    }

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`bg-[#13141a] border rounded-lg p-6 transition-all hover:shadow-lg ${
                          hasCondition 
                            ? 'border-orange-500/30 hover:border-orange-500/50 hover:shadow-orange-500/20' 
                            : 'border-[#1e1f26] hover:border-cyan-500/30 hover:shadow-cyan-500/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                              <span className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-sm font-bold shadow-lg">
                                Step #{index + 1}
                              </span>
                              <h3 className="text-xl font-bold text-white">{step.title}</h3>
                              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold uppercase border border-blue-500/30">
                                {step.type.replace('-', ' ')}
                              </span>
                              {step.required && (
                                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold uppercase border border-red-500/30">
                                  Required
                                </span>
                              )}
                              {hasCondition && (
                                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold flex items-center gap-1 border border-orange-500/30">
                                  <FiAlertCircle size={12} />
                                  Conditional
                                </span>
                              )}
                            </div>
                            
                            {step.subtitle && (
                              <p className="text-gray-400 mb-3 text-lg">{step.subtitle}</p>
                            )}
                            
                            {hasCondition && (
                              <div className="mb-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                                <p className="text-sm text-orange-400 italic flex items-center gap-2">
                                  <FiCode size={14} />
                                  {conditionText}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-6 text-sm">
                              <span className="text-gray-400 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                <strong className="text-white">{step.options?.length || 0}</strong> options configured
                              </span>
                              {step.id && (
                                <span className="text-gray-600 text-xs font-mono px-2 py-1 bg-[#1e1f26] rounded">
                                  ID: {step.id}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => editStep(step)}
                              className="p-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all border border-blue-500/30"
                              title="Edit step"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => deleteStep(step.id)}
                              className="p-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/30"
                              title="Delete step"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'pricing' && (
              <motion.div
                key="pricing"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Pricing Configuration</h2>
                  <p className="text-gray-400">Global pricing settings that apply to all calculations</p>
                </div>

                <InfoCard type="info" title="About Pricing Config">
                  These settings define the boundaries and base rules for your calculator. 
                  The <strong>base price</strong> is the starting point, while min/max ensure estimates stay within reasonable bounds.
                </InfoCard>

                <div className="mt-6 bg-[#13141a] border border-[#1e1f26] rounded-lg p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                          Currency
                        </label>
                        <HelpTooltip content="The currency used for all pricing calculations and displays." />
                      </div>
                      <select
                        value={calculator?.currency || 'INR'}
                        onChange={(e) => setCalculator({ ...calculator, currency: e.target.value })}
                        className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      >
                        <option value="INR" className="bg-[#1e1f26]">INR (₹)</option>
                        <option value="USD" className="bg-[#1e1f26]">USD ($)</option>
                        <option value="EUR" className="bg-[#1e1f26]">EUR (€)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                          Base Price
                        </label>
                        <HelpTooltip content="The starting price before any multipliers or additions are applied." />
                      </div>
                      <input
                        type="number"
                        value={calculator?.basePrice || 50000}
                        onChange={(e) => setCalculator({ ...calculator, basePrice: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                          Minimum Price
                        </label>
                        <HelpTooltip content="The lowest possible estimate your calculator will show. Prevents unrealistically low quotes." />
                      </div>
                      <input
                        type="number"
                        value={calculator?.pricingConfig?.minPrice || 25000}
                        onChange={(e) => updatePricingConfig('minPrice', Number(e.target.value))}
                        className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                          Maximum Price
                        </label>
                        <HelpTooltip content="The highest possible estimate. Caps extreme configurations at a reasonable limit." />
                      </div>
                      <input
                        type="number"
                        value={calculator?.pricingConfig?.maxPrice || 5000000}
                        onChange={(e) => updatePricingConfig('maxPrice', Number(e.target.value))}
                        className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                          GST Rate (%)
                        </label>
                        <HelpTooltip content="Tax percentage added to the final estimate. In India, this is typically 18%." />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        value={((calculator?.pricingConfig?.gstRate || 0.18) * 100).toFixed(2)}
                        onChange={(e) => updatePricingConfig('gstRate', Number(e.target.value) / 100)}
                        className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                          Estimate Variance (±%)
                        </label>
                        <HelpTooltip content="Creates a price range (e.g., ±20% gives a range from 80% to 120% of the calculated price)." />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        value={((calculator?.pricingConfig?.estimateVariance || 0.2) * 100).toFixed(2)}
                        onChange={(e) => updatePricingConfig('estimateVariance', Number(e.target.value) / 100)}
                        className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'rules' && (
              <motion.div
                key="rules"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Pricing Rules</h2>
                  <p className="text-gray-400">Fine-tune how different options affect the final price</p>
                </div>

                <InfoCard type="tip" title="How Pricing Rules Work">
                  <strong>Multipliers</strong> scale the price (e.g., 1.5× for complex projects). 
                  <strong>Add Costs</strong> add a fixed amount. These stack together to create the final estimate.
                </InfoCard>

                <div className="mt-6 space-y-6">
                  {/* Project Types */}
                  <div className="bg-[#13141a] border border-[#1e1f26] rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold text-cyan-400">Project Type Multipliers</h3>
                      <HelpTooltip 
                        title="Project Type Impact"
                        content="Different project types have different complexities. A mobile app (1.2×) is more complex than a simple website (0.5×)."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(calculator?.pricingRules?.projectTypeMultipliers || {}).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-4 bg-[#1e1f26] rounded-lg border border-[#252630] hover:border-cyan-500/30 transition-all">
                          <label className="block text-sm text-gray-400 mb-2 font-medium">{key}</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step="0.1"
                              value={value}
                              onChange={(e) => updatePricingRule('projectTypeMultipliers', key, Number(e.target.value))}
                              className="w-full px-3 py-2 bg-[#13141a] border border-[#252630] rounded text-white focus:ring-2 focus:ring-cyan-500"
                            />
                            <span className="text-gray-500 text-sm">×</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Service Costs */}
                  <div className="bg-[#13141a] border border-[#1e1f26] rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold text-cyan-400">Service Costs</h3>
                      <HelpTooltip 
                        title="Fixed Service Fees"
                        content="Additional costs for specific services. For example, mobile development might add ₹20,000 to the base price."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(calculator?.pricingRules?.serviceCosts || {}).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-4 bg-[#1e1f26] rounded-lg border border-[#252630] hover:border-cyan-500/30 transition-all">
                          <label className="block text-sm text-gray-400 mb-2 font-medium">{key}</label>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">{calculator?.currency === 'INR' ? '₹' : '$'}</span>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => updatePricingRule('serviceCosts', key, Number(e.target.value))}
                              className="w-full px-3 py-2 bg-[#13141a] border border-[#252630] rounded text-white focus:ring-2 focus:ring-cyan-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Step Modal */}
        {showStepModal && editingStep && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-[#13141a] rounded-2xl border border-cyan-500/30 max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-cyan-500/20"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FiLayers size={28} />
                    {editingStep.title || 'New Step'}
                  </h2>
                  <p className="text-white/80 text-sm mt-1">Configure step details, options, and conditional logic</p>
                </div>
                <button
                  onClick={() => {
                    setShowStepModal(false);
                    setEditingStep(null);
                  }}
                  className="p-3 hover:bg-white/20 rounded-lg transition-colors text-white"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(90vh-180px)]">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-cyan-400 rounded" />
                    Basic Information
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                          Step Title *
                        </label>
                        <HelpTooltip content="The main question or instruction users will see (e.g., 'Select your project type')" />
                      </div>
                      <input
                        type="text"
                        value={editingStep.title}
                        onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                        className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
                        placeholder="e.g., Select Project Type"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                          Subtitle (Optional)
                        </label>
                        <HelpTooltip content="Additional context or help text shown below the title" />
                      </div>
                      <input
                        type="text"
                        value={editingStep.subtitle}
                        onChange={(e) => setEditingStep({ ...editingStep, subtitle: e.target.value })}
                        className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
                        placeholder="e.g., Choose the category that best describes your project"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                            Step Type
                          </label>
                          <HelpTooltip content="Single-select: user picks one option. Multi-select: user can pick multiple. Contact: shows form. Estimate: shows final price." />
                        </div>
                        <select
                          value={editingStep.type}
                          onChange={(e) => setEditingStep({ ...editingStep, type: e.target.value })}
                          className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                        >
                          <option value="single-select">Single Select</option>
                          <option value="multi-select">Multi Select</option>
                          <option value="contact">Contact Form</option>
                          <option value="estimate">Estimate Display</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3 pt-8">
                        <input
                          type="checkbox"
                          id="required"
                          checked={editingStep.required}
                          onChange={(e) => setEditingStep({ ...editingStep, required: e.target.checked })}
                          className="w-5 h-5 text-cyan-500 bg-[#252630] border-gray-600 rounded focus:ring-2 focus:ring-cyan-500"
                        />
                        <label htmlFor="required" className="text-sm font-semibold text-gray-300 uppercase tracking-wide cursor-pointer">
                          Required Step
                        </label>
                        <HelpTooltip content="If checked, users must complete this step before continuing" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditional Logic */}
                <div className="p-6 bg-orange-500/10 border-2 border-orange-500/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <FiAlertCircle size={24} className="text-orange-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-orange-400 uppercase tracking-wide">
                        Conditional Logic
                      </h3>
                      <p className="text-sm text-gray-400">Make this step appear only when conditions are met</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        Condition (JSON Format)
                      </label>
                      <HelpTooltip 
                        title="Condition Examples"
                        content='equals: {"type":"equals","field":"projectType","value":"web-app"}
not_equals: {"type":"not_equals","field":"projectType","value":"website"}
includes: {"type":"includes","field":"selectedFeatures","value":"Authentication"}'
                      />
                    </div>
                    <textarea
                      value={editingStep.condition || ''}
                      onChange={(e) => setEditingStep({ ...editingStep, condition: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#13141a] border border-orange-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500 font-mono text-sm"
                      placeholder='{"type":"equals","field":"projectType","value":"web-app"}'
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                      <FiCode size={12} />
                      Leave empty to always show this step
                    </p>
                  </div>
                </div>

                {/* Options */}
                {(editingStep.type === 'single-select' || editingStep.type === 'multi-select') && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <div className="w-1 h-6 bg-cyan-400 rounded" />
                          Options
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">Choices users can select from</p>
                      </div>
                      <button
                        onClick={addOptionToStep}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 border border-green-500/30 text-sm font-semibold"
                      >
                        <FiPlus size={16} />
                        Add Option
                      </button>
                    </div>

                    {editingStep.options?.length === 0 && (
                      <InfoCard type="warning">
                        No options configured yet. Click "Add Option" to create choices for this step.
                      </InfoCard>
                    )}

                    <div className="space-y-4">
                      {editingStep.options?.map((option: any, index: number) => (
                        <div key={index} className="p-5 bg-[#1e1f26] rounded-lg border border-[#252630] hover:border-cyan-500/30 transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Option #{index + 1}</span>
                            <button
                              onClick={() => deleteStepOption(index)}
                              className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-all"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Title *</label>
                                <input
                                  type="text"
                                  value={option.title}
                                  onChange={(e) => updateStepOption(index, 'title', e.target.value)}
                                  placeholder="e.g., Web Application"
                                  className="w-full px-3 py-2 bg-[#13141a] border border-[#252630] rounded text-white text-sm focus:ring-2 focus:ring-cyan-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Key *</label>
                                <input
                                  type="text"
                                  value={option.key}
                                  onChange={(e) => updateStepOption(index, 'key', e.target.value)}
                                  placeholder="e.g., web-app"
                                  className="w-full px-3 py-2 bg-[#13141a] border border-[#252630] rounded text-white text-sm font-mono focus:ring-2 focus:ring-cyan-500"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Description</label>
                              <input
                                type="text"
                                value={option.description}
                                onChange={(e) => updateStepOption(index, 'description', e.target.value)}
                                placeholder="e.g., Full-featured web platform"
                                className="w-full px-3 py-2 bg-[#13141a] border border-[#252630] rounded text-white text-sm focus:ring-2 focus:ring-cyan-500"
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <label className="block text-xs text-gray-500 uppercase tracking-wide">Multiplier</label>
                                  <HelpTooltip content="Scales the price (e.g., 1.5× = 50% more expensive)" />
                                </div>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={option.multiplier}
                                  onChange={(e) => updateStepOption(index, 'multiplier', Number(e.target.value))}
                                  className="w-full px-3 py-2 bg-[#13141a] border border-[#252630] rounded text-white text-sm focus:ring-2 focus:ring-cyan-500"
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <label className="block text-xs text-gray-500 uppercase tracking-wide">Add Cost</label>
                                  <HelpTooltip content="Fixed amount added to price (e.g., ₹10,000)" />
                                </div>
                                <input
                                  type="number"
                                  value={option.addCost}
                                  onChange={(e) => updateStepOption(index, 'addCost', Number(e.target.value))}
                                  className="w-full px-3 py-2 bg-[#13141a] border border-[#252630] rounded text-white text-sm focus:ring-2 focus:ring-cyan-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Badge</label>
                                <button
                                  onClick={() => updateStepOption(index, 'isPopular', !option.isPopular)}
                                  className={`w-full px-3 py-2 rounded text-xs font-semibold uppercase transition-all ${
                                    option.isPopular 
                                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                                      : 'bg-[#13141a] text-gray-500 border border-[#252630]'
                                  }`}
                                >
                                  {option.isPopular ? '⭐ Popular' : 'Not Popular'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-[#1e1f26] px-8 py-6 flex justify-between items-center bg-[#13141a]">
                <button
                  onClick={() => {
                    setShowStepModal(false);
                    setEditingStep(null);
                  }}
                  className="px-6 py-3 bg-[#1e1f26] text-gray-300 rounded-lg hover:bg-[#252630] font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveStep}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/50 font-semibold"
                >
                  <FiCheck size={20} />
                  Save Step
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </ModernAdminLayout>
    </>
  );
}

