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

export default mockData;