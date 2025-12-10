import { ModernAdminLayout } from '../../components/admin/ModernAdminLayout';
import { InfoCard } from '../../components/admin/InfoCard';
import { HelpTooltip } from '../../components/admin/HelpTooltip';
import { useState } from 'react';
import Head from 'next/head';
import { FiCode, FiPlay, FiCheck, FiX, FiCopy, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { publicFetch, API_BASE_URL } from '../../utils/adminApi';

export default function ApiTestAdmin() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTest, setActiveTest] = useState<'calculate' | 'steps' | null>(null);
  const [testData, setTestData] = useState({
    projectType: 'web-app',
    selectedIndustries: ['SaaS', 'E-commerce'],
    selectedFeatures: ['User management', 'Authentication', 'Payment processing'],
    scope: 'standard',
    team: 'small',
    timeline: 'standard'
  });

  const testCalculateAPI = async () => {
    setLoading(true);
    setActiveTest('calculate');
    setTestResult(null);
    
    try {
      const result = await publicFetch('/api/calculator/calculate', {
        method: 'POST',
        body: JSON.stringify({ selections: testData })
      });
      setTestResult({ success: true, data: result, status: 200 });
    } catch (error: any) {
      setTestResult({ success: false, error: error.message, status: 'ERROR' });
    } finally {
      setLoading(false);
    }
  };

  const testStepsAPI = async () => {
    setLoading(true);
    setActiveTest('steps');
    setTestResult(null);
    
    try {
      const result = await publicFetch('/api/calculator/steps', {
        method: 'POST',
        body: JSON.stringify({ currentSelections: testData })
      });
      setTestResult({ success: true, data: result, status: 200 });
    } catch (error: any) {
      setTestResult({ success: false, error: error.message, status: 'ERROR' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetTest = () => {
    setTestResult(null);
    setActiveTest(null);
  };

  return (
    <>
      <Head>
        <title>API Testing - Admin</title>
      </Head>
      <ModernAdminLayout activeTab="SECURITY">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">Developer Tools</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">API Testing Console</h1>
                <p className="text-gray-400 text-lg">Test and debug your calculator API endpoints</p>
              </div>
              
              {testResult && (
                <button
                  onClick={resetTest}
                  className="flex items-center gap-2 px-6 py-3 bg-[#1e1f26] text-gray-300 rounded-lg hover:bg-[#252630] hover:text-cyan-400 transition-all border border-[#252630]"
                >
                  <FiRefreshCw size={20} />
                  Reset
                </button>
              )}
            </div>

            <InfoCard type="warning" title="Development Tool">
              This is a developer testing console for the calculator API. 
              Currently connected to: <strong>{API_BASE_URL}</strong>
              <br/>Changes made here do not affect production data.
            </InfoCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Test Configuration */}
            <div className="space-y-6">
              <div className="bg-[#13141a] border border-[#1e1f26] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FiCode size={20} className="text-cyan-400" />
                    <h2 className="text-xl font-bold text-white">Test Configuration</h2>
                  </div>
                  <HelpTooltip content="Configure the test data that will be sent to the API endpoints. Modify these values to test different scenarios." />
                </div>
                
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        Project Type
                      </label>
                      <HelpTooltip content="The main category of project being estimated" />
                    </div>
                    <select
                      value={testData.projectType}
                      onChange={(e) => setTestData({...testData, projectType: e.target.value})}
                      className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    >
                      <option value="website">Website</option>
                      <option value="web-app">Web Application</option>
                      <option value="mobile-app">Mobile App</option>
                      <option value="desktop-app">Desktop App</option>
                      <option value="api-backend">API & Backend</option>
                    </select>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        Scope
                      </label>
                      <HelpTooltip content="Project complexity level" />
                    </div>
                    <select
                      value={testData.scope}
                      onChange={(e) => setTestData({...testData, scope: e.target.value})}
                      className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    >
                      <option value="mvp">MVP</option>
                      <option value="standard">Standard</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        Team Size
                      </label>
                      <HelpTooltip content="Development team configuration" />
                    </div>
                    <select
                      value={testData.team}
                      onChange={(e) => setTestData({...testData, team: e.target.value})}
                      className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    >
                      <option value="solo">Solo Developer</option>
                      <option value="small">Small Team</option>
                      <option value="medium">Medium Team</option>
                      <option value="large">Large Team</option>
                    </select>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        Timeline
                      </label>
                      <HelpTooltip content="Project completion timeframe" />
                    </div>
                    <select
                      value={testData.timeline}
                      onChange={(e) => setTestData({...testData, timeline: e.target.value})}
                      className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    >
                      <option value="rush">Rush (1-2 months)</option>
                      <option value="standard">Standard (3-6 months)</option>
                      <option value="extended">Extended (6-12 months)</option>
                      <option value="ongoing">Ongoing (12+ months)</option>
                    </select>
                  </div>

                  {/* Selected Features Display */}
                  <div className="p-4 bg-[#1e1f26] border border-[#252630] rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Industries</p>
                    <div className="flex flex-wrap gap-2">
                      {testData.selectedIndustries.map(industry => (
                        <span key={industry} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-semibold border border-cyan-500/30">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-[#1e1f26] border border-[#252630] rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Features</p>
                    <div className="flex flex-wrap gap-2">
                      {testData.selectedFeatures.map(feature => (
                        <span key={feature} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold border border-blue-500/30">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* API Endpoints */}
              <div className="bg-[#13141a] border border-[#1e1f26] rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Available Endpoints</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={testCalculateAPI}
                    disabled={loading && activeTest === 'calculate'}
                    className="w-full p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/30 text-left disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">POST</span>
                          <span className="font-semibold">Calculate Price</span>
                        </div>
                        <p className="text-xs text-white/80">/api/calculator/calculate</p>
                      </div>
                      {loading && activeTest === 'calculate' ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FiPlay size={20} />
                      )}
                    </div>
                  </button>

                  <button
                    onClick={testStepsAPI}
                    disabled={loading && activeTest === 'steps'}
                    className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30 text-left disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">POST</span>
                          <span className="font-semibold">Get Next Steps</span>
                        </div>
                        <p className="text-xs text-white/80">/api/calculator/steps</p>
                      </div>
                      {loading && activeTest === 'steps' ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FiPlay size={20} />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              <div className="bg-[#13141a] border border-[#1e1f26] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Response</h2>
                  {testResult && (
                    <div className="flex items-center gap-2">
                      {testResult.success ? (
                        <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/30">
                          <FiCheck size={14} />
                          SUCCESS
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold border border-red-500/30">
                          <FiX size={14} />
                          ERROR
                        </span>
                      )}
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold border border-blue-500/30">
                        {testResult.status}
                      </span>
                    </div>
                  )}
                </div>

                {!testResult ? (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <FiCode size={48} className="text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Test</h3>
                    <p className="text-gray-400">
                      Select an endpoint to test and see the API response here
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {/* Response Content */}
                    <div className="space-y-4">
                      {testResult.error && (
                        <InfoCard type="warning">
                          <strong>Error:</strong> {testResult.error}
                        </InfoCard>
                      )}

                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">JSON Response</span>
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(testResult.data, null, 2))}
                            className="flex items-center gap-2 px-3 py-1 bg-[#1e1f26] text-gray-400 hover:text-cyan-400 rounded-lg transition-all text-xs font-semibold"
                          >
                            {copied ? (
                              <>
                                <FiCheck size={14} />
                                Copied!
                              </>
                            ) : (
                              <>
                                <FiCopy size={14} />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="bg-[#0a0b0d] border border-[#252630] rounded-lg p-4 overflow-x-auto text-xs">
                          <code className="text-gray-300 font-mono">
                            {JSON.stringify(testResult.data, null, 2)}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ModernAdminLayout>
    </>
  );
}
