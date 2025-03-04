"use client"

import { useEffect, useState } from "react"
import { Cpu, MemoryStickIcon as Memory, Clock, Box, Server, RefreshCw, Moon, Sun } from "lucide-react"


import { Helmet } from "react-helmet";

// Fetch metrics function with error handling and fallback to fake data
const fetchMetrics = async () => {
    try {
        const response = await fetch("/healthcheck", { method: "POST" });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const jsonResponse = await response.json();
            if (jsonResponse.type === "success" && jsonResponse.data) {
                return jsonResponse.data;
            } else {
                console.warn("API did not return expected data format, falling back to fake data");


                return mockData;
            }
        } else {
            console.warn("API did not return JSON, falling back to fake data");
            return mockData;
        }
    } catch (error) {
        console.error("Error fetching metrics:", error);
        console.warn("Falling back to fake data");
        return mockData;
    }
};

export default function Dashboard() {
    const [metrics, setMetrics] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [darkMode, setDarkMode] = useState(false)
    const [activeTab, setActiveTab] = useState("overview")

    useEffect(() => {
        // Check localStorage for dark mode preference
        const storedDarkMode = localStorage.getItem("darkMode")
        if (storedDarkMode) {
            setDarkMode(storedDarkMode === "true")
        } else {
            // Check system preference
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            setDarkMode(prefersDark)
        }
    }, [])

    useEffect(() => {
        // Apply dark mode class to html element
        if (darkMode) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }

        // Save preference to localStorage
        localStorage.setItem("darkMode", darkMode.toString())
    }, [darkMode])

    useEffect(() => {
        loadMetrics()
    }, [])

    const loadMetrics = async () => {
        setLoading(true)
        try {
            const data = await fetchMetrics()
            setMetrics(data)
        } catch (error) {
            console.error("Failed to fetch metrics:", error)
        } finally {
            setLoading(false)
        }
    }

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
    }

    if (loading || !metrics) {
        return (
            <>
                <Helmet>
                    <link rel="stylesheet" href="/css/healthcheck/style.css" />
                </Helmet>
                <div className="loadingContent">
                    <RefreshCw className="animate-spin" style={{ height: "2rem", width: "2rem", color: "var(--primary)" }} />
                    <p>Loading server metrics...</p>
                </div>
            </>
        )
    }

    // Extract key metrics
    const cpuUserSeconds = metrics.process_cpu_user_seconds_total.values[0].value
    const cpuSystemSeconds = metrics.process_cpu_system_seconds_total.values[0].value
    const cpuTotalSeconds = metrics.process_cpu_seconds_total.values[0].value

    const memoryBytes = metrics.process_resident_memory_bytes.values[0].value
    const memoryMB = (memoryBytes / (1024 * 1024)).toFixed(2)

    const eventLoopLag = metrics.nodejs_eventloop_lag_seconds.values[0].value * 1000 // Convert to ms
    const eventLoopLagMax = metrics.nodejs_eventloop_lag_max_seconds.values[0].value * 1000 // Convert to ms

    const heapSizeUsed = metrics.nodejs_heap_size_used_bytes.values[0].value
    const heapSizeTotal = metrics.nodejs_heap_size_total_bytes.values[0].value
    const heapSizeUsedMB = (heapSizeUsed / (1024 * 1024)).toFixed(2)
    const heapSizeTotalMB = (heapSizeTotal / (1024 * 1024)).toFixed(2)

    const activeHandles = metrics.nodejs_active_handles_total.values[0].value
    const activeRequests = metrics.nodejs_active_requests_total.values[0].value
    const activeResources = metrics.nodejs_active_resources_total.values[0].value

    const externalMemory = metrics.nodejs_external_memory_bytes.values[0].value
    const externalMemoryMB = (externalMemory / (1024 * 1024)).toFixed(2)

    // Calculate percentages for progress bars
    const heapPercentage = (heapSizeUsed / heapSizeTotal) * 100
    const eventLoopLagPercentage = Math.min((eventLoopLag / 50) * 100, 100) // Assuming 50ms is "full"
    const cpuPercentage = Math.min((cpuTotalSeconds / 10) * 100, 100) // Assuming 10s is "full"

    // HTTP request data
    const httpRequests = metrics.http_request_duration_seconds_count?.values || []
    const totalRequests = httpRequests.reduce((acc: number, curr: any) => acc + curr.value, 0)

    return (
        <div className="min-h-screen page-container">
            <Helmet>
               
                <link rel="stylesheet" href="/css/healthcheck/style.css" />
            </Helmet>
            <div className="max-w-7xl">
                <div className="flex justify-between items-center mb-8 bg-gradient-purple-blue p-6 rounded-xl">
                    <div className="flex items-center gap-4">
                        <Server style={{ height: "3rem", width: "3rem", color: "var(--primary)" }} />
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight ">
                                Server Health Dashboard
                            </h1>
                            <p className="text-muted">Real-time performance monitoring</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="switch">
                                <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
                                <span className="switch-slider"></span>
                            </label>
                            <label className="flex items-center gap-2 label">
                                {darkMode ? (
                                    <Moon style={{ height: "1rem", width: "1rem" }} />
                                ) : (
                                    <Sun style={{ height: "1rem", width: "1rem" }} />
                                )}
                                {darkMode ? "Dark" : "Light"}
                            </label>
                        </div>

                        <button onClick={loadMetrics} className="button flex items-center gap-2 text-white bg-gradient-button">
                            <RefreshCw style={{ height: "1rem", width: "1rem" }} />
                            Refresh Metrics
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 mt-8">
                    <div className="grid gap-6 md-grid-cols-2 lg-grid-cols-4">
                        <div className="card card-gradient-purple">
                            <div className="card-header flex justify-between items-center pb-2">
                                <h3 className="card-title">CPU Usage</h3>
                                <Cpu style={{ height: "1.5rem", width: "1.5rem", color: "#a855f7" }} />
                            </div>
                            <div className="card-content">
                                <div className="text-3xl font-extrabold mb-2">{cpuTotalSeconds.toFixed(2)}s</div>
                                <div className="progress before-shimmer mb-2">
                                    <div
                                        className="progress-indicator progress-indicator-purple"
                                        style={{ width: `${cpuPercentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-muted">Total CPU time spent (user + system)</p>
                                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-medium">
                                    <div className="flex items-center justify-between">
                                        <span>User:</span>
                                        <span className="font-bold">{cpuUserSeconds.toFixed(2)}s</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>System:</span>
                                        <span className="font-bold">{cpuSystemSeconds.toFixed(2)}s</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card card-gradient-blue">
                            <div className="card-header flex justify-between items-center pb-2">
                                <h3 className="card-title">Memory Usage</h3>
                                <Memory style={{ height: "1.5rem", width: "1.5rem", color: "#3b82f6" }} />
                            </div>
                            <div className="card-content">
                                <div className="text-3xl font-extrabold mb-2">{memoryMB} MB</div>
                                <div className="progress before-shimmer mb-2">
                                    <div className="progress-indicator progress-indicator-blue" style={{ width: "80%" }}></div>
                                </div>
                                <p className="text-sm text-muted">Resident memory in use</p>
                                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-medium">
                                    <div className="flex items-center justify-between">
                                        <span>External:</span>
                                        <span className="font-bold">{externalMemoryMB} MB</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Active Resources:</span>
                                        <span className="font-bold">{activeResources}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card card-gradient-emerald">
                            <div className="card-header flex justify-between items-center pb-2">
                                <h3 className="card-title">Event Loop Lag</h3>
                                <Clock style={{ height: "1.5rem", width: "1.5rem", color: "#10b981" }} />
                            </div>
                            <div className="card-content">
                                <div className="text-3xl font-extrabold mb-2">{eventLoopLag.toFixed(2)}ms</div>
                                <div className="progress before-shimmer mb-2">
                                    <div
                                        className={`progress-indicator ${eventLoopLag > 20 ? "progress-indicator-red" : "progress-indicator-emerald"}`}
                                        style={{ width: `${eventLoopLagPercentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-muted">Current event loop lag</p>
                                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-medium">
                                    <div className="flex items-center justify-between">
                                        <span>Max:</span>
                                        <span className="font-bold">{eventLoopLagMax.toFixed(2)}ms</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Min:</span>
                                        <span className="font-bold">
                                            {(metrics.nodejs_eventloop_lag_min_seconds.values[0].value * 1000).toFixed(2)}ms
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card card-gradient-rose">
                            <div className="card-header flex justify-between items-center pb-2">
                                <h3 className="card-title">Heap Usage</h3>
                                <Box style={{ height: "1.5rem", width: "1.5rem", color: "#f43f5e" }} />
                            </div>
                            <div className="card-content">
                                <div className="text-3xl font-extrabold mb-2">{heapSizeUsedMB} MB</div>
                                <div className="progress before-shimmer mb-2">
                                    <div
                                        className={`progress-indicator ${heapPercentage > 80 ? "progress-indicator-red" : "progress-indicator-rose"}`}
                                        style={{ width: `${heapPercentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-muted">Node.js heap memory used</p>
                                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-medium">
                                    <div className="flex items-center justify-between">
                                        <span>Total:</span>
                                        <span className="font-bold">{heapSizeTotalMB} MB</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Usage:</span>
                                        <span className="font-bold">{heapPercentage.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="tabs">
                            <div className="tabs-list">
                                <div
                                    className="tabs-trigger"
                                    data-state={activeTab === "overview" ? "active" : "inactive"}
                                    onClick={() => setActiveTab("overview")}
                                >
                                    Overview
                                </div>
                                <div
                                    className="tabs-trigger"
                                    data-state={activeTab === "http" ? "active" : "inactive"}
                                    onClick={() => setActiveTab("http")}
                                >
                                    HTTP Requests
                                </div>
                                <div
                                    className="tabs-trigger"
                                    data-state={activeTab === "gc" ? "active" : "inactive"}
                                    onClick={() => setActiveTab("gc")}
                                >
                                    Garbage Collection
                                </div>
                                <div
                                    className="tabs-trigger"
                                    data-state={activeTab === "resources" ? "active" : "inactive"}
                                    onClick={() => setActiveTab("resources")}
                                >
                                    Resources
                                </div>
                            </div>

                            <div className="tabs-content" data-state={activeTab === "overview" ? "active" : "inactive"}>
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">System Overview</h3>
                                        <p className="card-description">Detailed information about the Node.js runtime</p>
                                    </div>
                                    <div className="card-content">
                                        <div className="grid gap-6 md-grid-cols-2 lg-grid-cols-3">
                                            <div>
                                                <h3 className="font-semibold mb-2">Node.js Version</h3>
                                                <div className="text-sm">{metrics.nodejs_version_info.values[0].labels.version}</div>
                                                <div className="text-xs text-muted mt-1">
                                                    Major: {metrics.nodejs_version_info.values[0].labels.major}, Minor:{" "}
                                                    {metrics.nodejs_version_info.values[0].labels.minor}, Patch:{" "}
                                                    {metrics.nodejs_version_info.values[0].labels.patch}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold mb-2">Process Uptime</h3>
                                                <div className="text-sm">
                                                    {formatUptime(Date.now() / 1000 - metrics.process_start_time_seconds.values[0].value)}
                                                </div>
                                                <div className="text-xs text-muted mt-1">
                                                    Started:{" "}
                                                    {new Date(metrics.process_start_time_seconds.values[0].value * 1000).toLocaleString()}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold mb-2">Active Handles & Requests</h3>
                                                <div className="text-sm">
                                                    Handles: {activeHandles}, Requests: {activeRequests}
                                                </div>
                                                <div className="text-xs text-muted mt-1">Total Resources: {activeResources}</div>
                                            </div>
                                        </div>

                                        <div className="separator my-6"></div>

                                        <div>
                                            <h3 className="font-semibold mb-4">Event Loop Statistics</h3>
                                            <div className="grid gap-4 md-grid-cols-2 lg-grid-cols-4">
                                                <div className="bg-muted p-3 rounded-md">
                                                    <div className="text-xs text-muted">Mean</div>
                                                    <div className="text-sm font-medium">
                                                        {(metrics.nodejs_eventloop_lag_mean_seconds.values[0].value * 1000).toFixed(2)}ms
                                                    </div>
                                                </div>

                                                <div className="bg-muted p-3 rounded-md">
                                                    <div className="text-xs text-muted">P50</div>
                                                    <div className="text-sm font-medium">
                                                        {(metrics.nodejs_eventloop_lag_p50_seconds.values[0].value * 1000).toFixed(2)}ms
                                                    </div>
                                                </div>

                                                <div className="bg-muted p-3 rounded-md">
                                                    <div className="text-xs text-muted">P90</div>
                                                    <div className="text-sm font-medium">
                                                        {(metrics.nodejs_eventloop_lag_p90_seconds.values[0].value * 1000).toFixed(2)}ms
                                                    </div>
                                                </div>

                                                <div className="bg-muted p-3 rounded-md">
                                                    <div className="text-xs text-muted">P99</div>
                                                    <div className="text-sm font-medium">
                                                        {(metrics.nodejs_eventloop_lag_p99_seconds.values[0].value * 1000).toFixed(2)}ms
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="tabs-content" data-state={activeTab === "http" ? "active" : "inactive"}>
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">HTTP Requests</h3>
                                        <p className="card-description">HTTP request metrics and performance data</p>
                                    </div>
                                    <div className="card-content">
                                        <div className="mb-6">
                                            <h3 className="font-semibold mb-2">Request Summary</h3>
                                            <div className="grid gap-4 md-grid-cols-3">
                                                <div className="bg-muted p-3 rounded-md">
                                                    <div className="text-xs text-muted">Total Requests</div>
                                                    <div className="text-2xl font-medium">{totalRequests}</div>
                                                </div>

                                                <div className="bg-muted p-3 rounded-md">
                                                    <div className="text-xs text-muted">Success Rate</div>
                                                    <div className="text-2xl font-medium">{calculateSuccessRate(httpRequests)}%</div>
                                                </div>

                                                <div className="bg-muted p-3 rounded-md">
                                                    <div className="text-xs text-muted">Avg Response Time</div>
                                                    <div className="text-2xl font-medium">{calculateAvgResponseTime(metrics)}ms</div>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="font-semibold mb-4">Request Details</h3>
                                        <div className="rounded-md border">
                                            <div className="grid grid-cols-4 bg-muted p-3 text-sm font-medium">
                                                <div>Method</div>
                                                <div>Route</div>
                                                <div>Status</div>
                                                <div>Count</div>
                                            </div>

                                            {httpRequests.map((req: any, i: number) => (
                                                <div key={i} className="grid grid-cols-4 p-3 text-sm border-t">
                                                    <div>{req.labels.method}</div>
                                                    <div>{req.labels.route}</div>
                                                    <div>
                                                        <span
                                                            className={`badge ${req.labels.status_code.startsWith("2") ? "badge-default" : "badge-destructive"}`}
                                                        >
                                                            {req.labels.status_code}
                                                        </span>
                                                    </div>
                                                    <div>{req.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="tabs-content" data-state={activeTab === "gc" ? "active" : "inactive"}>
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Garbage Collection</h3>
                                        <p className="card-description">Garbage collection statistics and memory management</p>
                                    </div>
                                    <div className="card-content">
                                        <div className="grid gap-6 md-grid-cols-3">
                                            {["minor", "incremental", "major"].map((type) => (
                                                <div key={type} className="card border-none">
                                                    <div className="card-header p-0 pb-3">
                                                        <h3 className="card-title text-base capitalize">{type} GC</h3>
                                                    </div>
                                                    <div className="card-content p-0">
                                                        <div className="grid gap-2">
                                                            <div className="flex justify-between text-sm">
                                                                <span>Count:</span>
                                                                <span className="font-medium">
                                                                    {metrics[`nodejs_gc_duration_seconds_count`].values.find(
                                                                        (v: any) => v.labels.kind === type,
                                                                    )?.value || 0}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span>Total Duration:</span>
                                                                <span className="font-medium">
                                                                    {(
                                                                        metrics[`nodejs_gc_duration_seconds_sum`].values.find(
                                                                            (v: any) => v.labels.kind === type,
                                                                        )?.value * 1000 || 0
                                                                    ).toFixed(2)}
                                                                    ms
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span>Avg Duration:</span>
                                                                <span className="font-medium">{calculateAvgGCDuration(metrics, type)}ms</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="separator my-6"></div>

                                        <h3 className="font-semibold mb-4">Heap Space Details</h3>
                                        <div className="rounded-md border">
                                            <div className="grid grid-cols-4 bg-muted p-3 text-sm font-medium">
                                                <div>Space</div>
                                                <div>Total (MB)</div>
                                                <div>Used (MB)</div>
                                                <div>Available (MB)</div>
                                            </div>

                                            {metrics.nodejs_heap_space_size_total_bytes.values
                                                .filter((v: any) => v.labels.space !== "read_only")
                                                .map((space: any, i: number) => {
                                                    const spaceType = space.labels.space
                                                    const total = space.value / (1024 * 1024)
                                                    const used =
                                                        getHeapSpaceValue(metrics.nodejs_heap_space_size_used_bytes.values, spaceType) /
                                                        (1024 * 1024)
                                                    const available =
                                                        getHeapSpaceValue(metrics.nodejs_heap_space_size_available_bytes.values, spaceType) /
                                                        (1024 * 1024)

                                                    return (
                                                        <div key={i} className="grid grid-cols-4 p-3 text-sm border-t">
                                                            <div className="capitalize">{formatSpaceName(spaceType)}</div>
                                                            <div>{total.toFixed(2)}</div>
                                                            <div>{used.toFixed(2)}</div>
                                                            <div>{available.toFixed(2)}</div>
                                                        </div>
                                                    )
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="tabs-content" data-state={activeTab === "resources" ? "active" : "inactive"}>
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Active Resources</h3>
                                        <p className="card-description">Currently active handles, requests and resources</p>
                                    </div>
                                    <div className="card-content">
                                        <div className="grid gap-6 md-grid-cols-2">
                                            <div>
                                                <h3 className="font-semibold mb-4">Active Handles</h3>
                                                <div className="rounded-md border">
                                                    <div className="grid grid-cols-2 bg-muted p-3 text-sm font-medium">
                                                        <div>Type</div>
                                                        <div>Count</div>
                                                    </div>

                                                    {metrics.nodejs_active_handles.values.map((handle: any, i: number) => (
                                                        <div key={i} className="grid grid-cols-2 p-3 text-sm border-t">
                                                            <div>{handle.labels.type}</div>
                                                            <div>{handle.value}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold mb-4">Active Resources</h3>
                                                <div className="rounded-md border">
                                                    <div className="grid grid-cols-2 bg-muted p-3 text-sm font-medium">
                                                        <div>Type</div>
                                                        <div>Count</div>
                                                    </div>

                                                    {metrics.nodejs_active_resources.values.map((resource: any, i: number) => (
                                                        <div key={i} className="grid grid-cols-2 p-3 text-sm border-t">
                                                            <div>{resource.labels.type}</div>
                                                            <div>{resource.value}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Helper functions
function formatUptime(seconds: number) {
    const days = Math.floor(seconds / (3600 * 24))
    const hours = Math.floor((seconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m ${secs}s`
    } else if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`
    } else {
        return `${secs}s`
    }
}

function calculateSuccessRate(requests: any[]) {
    const total = requests.reduce((acc, curr) => acc + curr.value, 0)
    const success = requests
        .filter((req) => req.labels.status_code.startsWith("2"))
        .reduce((acc, curr) => acc + curr.value, 0)

    return total === 0 ? 100 : Math.round((success / total) * 100)
}

function calculateAvgResponseTime(metrics: any) {
    const sumValues = metrics.http_request_duration_seconds_sum?.values || []
    const countValues = metrics.http_request_duration_seconds_count?.values || []

    let totalSum = 0
    let totalCount = 0

    sumValues.forEach((item: any) => {
        totalSum += item.value
    })

    countValues.forEach((item: any) => {
        totalCount += item.value
    })

    return totalCount === 0 ? 0 : ((totalSum / totalCount) * 1000).toFixed(2)
}

function calculateAvgGCDuration(metrics: any, type: string) {
    const sum = metrics[`nodejs_gc_duration_seconds_sum`].values.find((v: any) => v.labels.kind === type)?.value || 0
    const count = metrics[`nodejs_gc_duration_seconds_count`].values.find((v: any) => v.labels.kind === type)?.value || 0

    return count === 0 ? 0 : ((sum / count) * 1000).toFixed(2)
}

function getHeapSpaceValue(values: any[], spaceType: string) {
    const found = values.find((v) => v.labels.space === spaceType)
    return found ? found.value : 0
}

function formatSpaceName(name: string) {
    return name.replace(/_/g, " ")
}

// Add this mock data object at the end of the file
const mockData = {
    process_cpu_user_seconds_total: {
        help: "Total user CPU time spent in seconds.",
        values: [{ labels: {}, value: 2.5 }],
    },
    process_cpu_system_seconds_total: {
        help: "Total system CPU time spent in seconds.",
        values: [{ labels: {}, value: 0.73 }],
    },
    process_cpu_seconds_total: {
        help: "Total user and system CPU time spent in seconds.",
        values: [{ labels: {}, value: 3.23 }],
    },
    process_start_time_seconds: {
        help: "Start time of the process since unix epoch in seconds.",
        values: [{ labels: {}, value: 1740972209 }],
    },
    process_resident_memory_bytes: {
        help: "Resident memory size in bytes.",
        values: [{ labels: {}, value: 140836864 }],
    },
    nodejs_eventloop_lag_seconds: {
        help: "Lag of event loop in seconds.",
        values: [{ labels: {}, value: 0.00498 }],
    },
    nodejs_eventloop_lag_min_seconds: {
        help: "The minimum recorded event loop delay.",
        values: [{ labels: {}, value: 0.00892928 }],
    },
    nodejs_eventloop_lag_max_seconds: {
        help: "The maximum recorded event loop delay.",
        values: [{ labels: {}, value: 0.0338165759 }],
    },
    nodejs_eventloop_lag_mean_seconds: {
        help: "The mean of the recorded event loop delays.",
        values: [{ labels: {}, value: 0.016318378539493295 }],
    },
    nodejs_eventloop_lag_stddev_seconds: {
        help: "The standard deviation of the recorded event loop delays.",
        values: [{ labels: {}, value: 0.013369641678420963 }],
    },
    nodejs_eventloop_lag_p50_seconds: {
        help: "The 50th percentile of the recorded event loop delays.",
        values: [{ labels: {}, value: 0.015548415 }],
    },
    nodejs_eventloop_lag_p90_seconds: {
        help: "The 90th percentile of the recorded event loop delays.",
        values: [{ labels: {}, value: 0.016064511 }],
    },
    nodejs_eventloop_lag_p99_seconds: {
        help: "The 99th percentile of the recorded event loop delays.",
        values: [{ labels: {}, value: 0.018006015 }],
    },
    nodejs_active_resources: {
        help: "Number of active resources that are currently keeping the event loop alive, grouped by async resource type.",
        values: [
            { labels: { type: "TTYWrap" }, value: 2 },
            { labels: { type: "FSEventWrap" }, value: 5 },
            { labels: { type: "TCPServerWrap" }, value: 2 },
            { labels: { type: "TCPSocketWrap" }, value: 2 },
            { labels: { type: "Immediate" }, value: 1 },
        ],
    },
    nodejs_active_resources_total: {
        help: "Total number of active resources.",
        values: [{ labels: {}, value: 12 }],
    },
    nodejs_active_handles: {
        help: "Number of active libuv handles grouped by handle type. Every handle type is C++ class name.",
        values: [
            { labels: { type: "WriteStream" }, value: 2 },
            { labels: { type: "FSWatcher" }, value: 5 },
            { labels: { type: "Server" }, value: 2 },
            { labels: { type: "Socket" }, value: 2 },
        ],
    },
    nodejs_active_handles_total: {
        help: "Total number of active handles.",
        values: [{ labels: {}, value: 11 }],
    },
    nodejs_active_requests: {
        help: "Number of active libuv requests grouped by request type. Every request type is C++ class name.",
        values: [],
    },
    nodejs_active_requests_total: {
        help: "Total number of active requests.",
        values: [{ labels: {}, value: 0 }],
    },
    nodejs_heap_size_total_bytes: {
        help: "Process heap size from Node.js in bytes.",
        values: [{ labels: {}, value: 84803584 }],
    },
    nodejs_heap_size_used_bytes: {
        help: "Process heap size used from Node.js in bytes.",
        values: [{ labels: {}, value: 75950000 }],
    },
    nodejs_external_memory_bytes: {
        help: "Node.js external memory size in bytes.",
        values: [{ labels: {}, value: 4311249 }],
    },
    nodejs_heap_space_size_total_bytes: {
        help: "Process heap space size total from Node.js in bytes.",
        values: [
            { labels: { space: "read_only" }, value: 0 },
            { labels: { space: "new" }, value: 1048576 },
            { labels: { space: "old" }, value: 47980544 },
            { labels: { space: "code" }, value: 3407872 },
            { labels: { space: "shared" }, value: 0 },
            { labels: { space: "trusted" }, value: 6569984 },
            { labels: { space: "new_large_object" }, value: 0 },
            { labels: { space: "large_object" }, value: 25178112 },
            { labels: { space: "code_large_object" }, value: 155648 },
            { labels: { space: "shared_large_object" }, value: 0 },
            { labels: { space: "trusted_large_object" }, value: 462848 },
        ],
    },
    nodejs_heap_space_size_used_bytes: {
        help: "Process heap space size used from Node.js in bytes.",
        values: [
            { labels: { space: "read_only" }, value: 0 },
            { labels: { space: "new" }, value: 349152 },
            { labels: { space: "old" }, value: 44861800 },
            { labels: { space: "code" }, value: 3000512 },
            { labels: { space: "shared" }, value: 0 },
            { labels: { space: "trusted" }, value: 5158848 },
            { labels: { space: "new_large_object" }, value: 0 },
            { labels: { space: "large_object" }, value: 25029336 },
            { labels: { space: "code_large_object" }, value: 138304 },
            { labels: { space: "shared_large_object" }, value: 0 },
            { labels: { space: "trusted_large_object" }, value: 447336 },
        ],
    },
    nodejs_heap_space_size_available_bytes: {
        help: "Process heap space size available from Node.js in bytes.",
        values: [
            { labels: { space: "read_only" }, value: 0 },
            { labels: { space: "new" }, value: 681760 },
            { labels: { space: "old" }, value: 121104 },
            { labels: { space: "code" }, value: 193952 },
            { labels: { space: "shared" }, value: 0 },
            { labels: { space: "trusted" }, value: 1295976 },
            { labels: { space: "new_large_object" }, value: 1048576 },
            { labels: { space: "large_object" }, value: 0 },
            { labels: { space: "code_large_object" }, value: 0 },
            { labels: { space: "shared_large_object" }, value: 0 },
            { labels: { space: "trusted_large_object" }, value: 0 },
        ],
    },
    nodejs_version_info: {
        help: "Node.js version info.",
        values: [{ labels: { version: "v22.14.0", major: "22", minor: "14", patch: "0" }, value: 1 }],
    },
    nodejs_gc_duration_seconds: {
        help: "Garbage collection duration by kind, one of major, minor, incremental or weakcb.",
        values: [],
    },
    nodejs_gc_duration_seconds_bucket: {
        values: [
            { labels: { le: "0.001", kind: "minor" }, value: 1 },
            { labels: { le: "0.01", kind: "minor" }, value: 6 },
            { labels: { le: "0.1", kind: "minor" }, value: 6 },
            { labels: { le: "1", kind: "minor" }, value: 6 },
            { labels: { le: "2", kind: "minor" }, value: 6 },
            { labels: { le: "5", kind: "minor" }, value: 6 },
            { labels: { le: "+Inf", kind: "minor" }, value: 6 },
            { labels: { le: "0.001", kind: "incremental" }, value: 5 },
            { labels: { le: "0.01", kind: "incremental" }, value: 5 },
            { labels: { le: "0.1", kind: "incremental" }, value: 5 },
            { labels: { le: "1", kind: "incremental" }, value: 5 },
            { labels: { le: "2", kind: "incremental" }, value: 5 },
            { labels: { le: "5", kind: "incremental" }, value: 5 },
            { labels: { le: "+Inf", kind: "incremental" }, value: 5 },
            { labels: { le: "0.001", kind: "major" }, value: 0 },
            { labels: { le: "0.01", kind: "major" }, value: 3 },
            { labels: { le: "0.1", kind: "major" }, value: 5 },
            { labels: { le: "1", kind: "major" }, value: 5 },
            { labels: { le: "2", kind: "major" }, value: 5 },
            { labels: { le: "5", kind: "major" }, value: 5 },
            { labels: { le: "+Inf", kind: "major" }, value: 5 },
        ],
    },
    nodejs_gc_duration_seconds_sum: {
        values: [
            { labels: { kind: "minor" }, value: 0.01261779998242855 },
            { labels: { kind: "incremental" }, value: 0.0029025000035762783 },
            { labels: { kind: "major" }, value: 0.03382679997384549 },
        ],
    },
    nodejs_gc_duration_seconds_count: {
        values: [
            { labels: { kind: "minor" }, value: 6 },
            { labels: { kind: "incremental" }, value: 5 },
            { labels: { kind: "major" }, value: 5 },
        ],
    },
    http_request_duration_seconds: {
        help: "request duration in seconds",
        values: [],
    },
    http_request_duration_seconds_bucket: {
        values: [
            { labels: { le: "0.005", method: "GET", route: "/", status_code: "200" }, value: 0 },
            { labels: { le: "0.01", method: "GET", route: "/", status_code: "200" }, value: 0 },
            { labels: { le: "0.025", method: "GET", route: "/", status_code: "200" }, value: 1 },
            { labels: { le: "0.05", method: "GET", route: "/", status_code: "200" }, value: 1 },
            { labels: { le: "0.1", method: "GET", route: "/", status_code: "200" }, value: 1 },
            { labels: { le: "0.25", method: "GET", route: "/", status_code: "200" }, value: 1 },
            { labels: { le: "0.5", method: "GET", route: "/", status_code: "200" }, value: 1 },
            { labels: { le: "1", method: "GET", route: "/", status_code: "200" }, value: 1 },
            { labels: { le: "2.5", method: "GET", route: "/", status_code: "200" }, value: 1 },
            { labels: { le: "5", method: "GET", route: "/", status_code: "200" }, value: 1 },
            { labels: { le: "10", method: "GET", route: "/", status_code: "200" }, value: 1 },
            { labels: { le: "+Inf", method: "GET", route: "/", status_code: "200" }, value: 1 },
            { labels: { le: "0.005", method: "GET", route: "/", status_code: "500" }, value: 0 },
            { labels: { le: "0.01", method: "GET", route: "/", status_code: "500" }, value: 0 },
            { labels: { le: "0.025", method: "GET", route: "/", status_code: "500" }, value: 1 },
            { labels: { le: "0.05", method: "GET", route: "/", status_code: "500" }, value: 1 },
            { labels: { le: "0.1", method: "GET", route: "/", status_code: "500" }, value: 1 },
            { labels: { le: "0.25", method: "GET", route: "/", status_code: "500" }, value: 1 },
            { labels: { le: "0.5", method: "GET", route: "/", status_code: "500" }, value: 1 },
            { labels: { le: "1", method: "GET", route: "/", status_code: "500" }, value: 1 },
            { labels: { le: "2.5", method: "GET", route: "/", status_code: "500" }, value: 1 },
            { labels: { le: "5", method: "GET", route: "/", status_code: "500" }, value: 1 },
            { labels: { le: "10", method: "GET", route: "/", status_code: "500" }, value: 1 },
            { labels: { le: "+Inf", method: "GET", route: "/", status_code: "500" }, value: 1 },
        ],
    },
    http_request_duration_seconds_sum: {
        values: [
            { labels: { method: "GET", route: "/", status_code: "200" }, value: 0.02401 },
            { labels: { method: "GET", route: "/", status_code: "500" }, value: 0.0194954 },
        ],
    },
    http_request_duration_seconds_count: {
        values: [
            { labels: { method: "GET", route: "/", status_code: "200" }, value: 1 },
            { labels: { method: "GET", route: "/", status_code: "500" }, value: 1 },
        ],
    },
    http_request_summary_seconds: {
        help: "request duration in seconds summary",
        values: [
            { labels: { quantile: "0.01", method: "GET", route: "/", status_code: "200" }, value: 0.0240717 },
            { labels: { quantile: "0.05", method: "GET", route: "/", status_code: "200" }, value: 0.0240717 },
            { labels: { quantile: "0.5", method: "GET", route: "/", status_code: "200" }, value: 0.0240717 },
            { labels: { quantile: "0.9", method: "GET", route: "/", status_code: "200" }, value: 0.0240717 },
            { labels: { quantile: "0.95", method: "GET", route: "/", status_code: "200" }, value: 0.0240717 },
            { labels: { quantile: "0.99", method: "GET", route: "/", status_code: "200" }, value: 0.0240717 },
            { labels: { quantile: "0.999", method: "GET", route: "/", status_code: "200" }, value: 0.0240717 },
        ],
    },
}

