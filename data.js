const ROADMAP = [

  {
    id: "P0",
    name: "Lab و عادت‌های حرفه‌ای",
    track: "Linux",
    sessions: [
      ["S01", "Lab Architecture"],
      ["S02", "Server Install"],
      ["S03", "Admin Habits"]
    ]
  },

  {
    id: "P1",
    name: "Foundations سیستماتیک",
    track: "Linux",
    sessions: [
      ["S04", "Shell Internals"],
      ["S05", "Streams"],
      ["S06", "Text Tools"],
      ["S07", "Regex و Log Slicing"],
      ["S08", "find و xargs"],
      ["S09", "Environment"],
      ["S10", "FHS و inode"],
      ["S11", "Special Filesystems"],
      ["S12", "Archive و Copy"],
      ["S13", "Users / Groups"],
      ["S14", "Permission Model"],
      ["S15", "ACL و sudo"],
      ["S16", "Permission Troubleshooting"],
      ["S17", "apt/dpkg و dnf/rpm"],
      ["S18", "Repos و Verification"],
      ["S19", "Process Model"],
      ["S20", "Process Internals"],
      ["S21", "Cumulative + Project"],
      ["S22", "Phase 1 Assessment"]
    ]
  },

  {
    id: "P2",
    name: "Core System Administration",
    track: "Linux",
    sessions: [
      ["S23", "Boot Chain"],
      ["S24", "GRUB2 و Recovery"],
      ["S25", "systemd Units"],
      ["S26", "Custom Units"],
      ["S27", "Timers و journald"],
      ["S28", "Boot / Service Troubleshooting"],
      ["S29", "Block Devices"],
      ["S30", "Filesystems"],
      ["S31", "Filesystem Internals"],
      ["S32", "LVM I"],
      ["S33", "LVM II"],
      ["S34", "RAID"],
      ["S35", "Swap / zram / Quota"],
      ["S36", "LUKS"],
      ["S37", "Storage Troubleshooting"],
      ["S38", "Storage Project"],
      ["S39", "PAM"],
      ["S40", "SSH Fundamentals"],
      ["S41", "Central Authentication"],
      ["S42", "cron و at"],
      ["S43", "Logging"],
      ["S44", "Backup"],
      ["S45", "Phase 2 Project"],
      ["S46", "Phase 2 Assessment"]
    ]
  },

  {
    id: "P3",
    name: "Networking",
    track: "Linux",
    sessions: [
      ["S47", "TCP/IP برای Admin"],
      ["S48", "ip / ss / nmcli / netplan"],
      ["S49", "Routing"],
      ["S50", "ARP / VLAN / Bridge"],
      ["S51", "Bonding / Teaming"],
      ["S52", "DNS Client"],
      ["S53", "TCP Deep Dive"],
      ["S54", "tcpdump / Wireshark"],
      ["S55", "Netfilter / nftables"],
      ["S56", "NAT"],
      ["S57", "Namespaces و veth"],
      ["S58", "Network Troubleshooting"],
      ["S59", "Project — Gateway"],
      ["S60", "Phase 3 Assessment"]
    ]
  },

  {
    id: "P4",
    name: "Bash، Git و Python",
    track: "Linux",
    sessions: [
      ["S61", "Script Basics"],
      ["S62", "Loops / Functions / Arrays"],
      ["S63", "Robust Scripting"],
      ["S64", "Args / Logging / Locks"],
      ["S65", "awk / sed پیشرفته"],
      ["S66", "Real Scripts I"],
      ["S67", "Real Scripts II"],
      ["S68", "Testing — bats / Style"],
      ["S69", "Git Fundamentals"],
      ["S70", "Branch / Merge / Rebase"],
      ["S71", "Workflows"],
      ["S72", "Python for Sysadmin I"],
      ["S73", "Python II"],
      ["S74", "Project"],
      ["S75", "Phase 4 Assessment"]
    ]
  },

  {
    id: "P5",
    name: "Network Services",
    track: "Linux",
    sessions: [
      ["S76", "SSH Bastion"],
      ["S77", "DNS I — Unbound"],
      ["S78", "DNS II — BIND"],
      ["S79", "DNS III — Split-Horizon"],
      ["S80", "DHCP — Kea / ISC + PXE"],
      ["S81", "Time — chrony"],
      ["S82", "Nginx"],
      ["S83", "Apache"],
      ["S84", "PKI و TLS"],
      ["S85", "ACME / Let's Encrypt"],
      ["S86", "Reverse Proxy و Load Balancing"],
      ["S87", "NFS"],
      ["S88", "Samba"],
      ["S89", "SFTP Chroot"],
      ["S90", "Database Administration"],
      ["S91", "Postfix — Optional"],
      ["S92", "Project"],
      ["S93", "Phase 5 Assessment"]
    ]
  },

  {
    id: "P6",
    name: "Security و Hardening",
    track: "Linux",
    sessions: [
      ["S94", "Threat Model"],
      ["S95", "Account / SSH / sudo Hardening"],
      ["S96", "Firewall Policy"],
      ["S97", "SELinux I"],
      ["S98", "SELinux II"],
      ["S99", "SELinux III + AppArmor"],
      ["S100", "auditd"],
      ["S101", "fail2ban / CrowdSec"],
      ["S102", "Kernel Hardening"],
      ["S103", "CIS / OpenSCAP / Lynis"],
      ["S104", "Patch و Vulnerability Management"],
      ["S105", "Secrets و GPG"],
      ["S106", "Incident Response"],
      ["S107", "Project"],
      ["S108", "Phase 6 Assessment"]
    ]
  },

  {
    id: "P7",
    name: "Performance، Troubleshooting و Internals",
    track: "Linux",
    sessions: [
      ["S109", "USE Method"],
      ["S110", "CPU و Scheduler"],
      ["S111", "Memory Management"],
      ["S112", "Memory Leak Lab"],
      ["S113", "Disk I/O"],
      ["S114", "FD و Limits"],
      ["S115", "Network Tuning"],
      ["S116", "strace / ltrace / perf"],
      ["S117", "eBPF / bpftrace"],
      ["S118", "Syscalls و Kernel Modules"],
      ["S119", "cgroups v2"],
      ["S120", "Namespaces"],
      ["S121", "Monitoring پایه"],
      ["S122", "Central Logging پایه"],
      ["S123", "Virtualization"],
      ["S124", "Kernel Operations"],
      ["S125", "Troubleshooting Bootcamp I"],
      ["S126", "Troubleshooting Bootcamp II"],
      ["S127", "Troubleshooting Bootcamp III"],
      ["S128", "Troubleshooting Bootcamp IV"],
      ["S129", "Phase 7 Assessment"]
    ]
  },

  {
    id: "P8",
    name: "Linux Capstone و Gate",
    track: "Linux",
    sessions: [
      ["S130", "Architecture Design"],
      ["S131", "Capstone Build — Networking"],
      ["S132", "Capstone Build — Storage"],
      ["S133", "Capstone Build — Services"],
      ["S134", "Capstone Build — Security / Monitoring / Backup / Automation"],
      ["S135", "Chaos Day"],
      ["S136", "Linux Professional Assessment + Gate Review"]
    ]
  },

  {
    id: "P9",
    name: "Containers و Docker",
    track: "DevOps / SRE",
    sessions: [
      ["S137", "Container vs VM و Internals"],
      ["S138", "Docker CLI"],
      ["S139", "Dockerfile و Multi-stage"],
      ["S140", "Docker Networking"],
      ["S141", "Volumes و Storage"],
      ["S142", "Compose"],
      ["S143", "Registry و Tagging"],
      ["S144", "Image Security"],
      ["S145", "Podman / Buildah"],
      ["S146", "Container Troubleshooting"],
      ["S147", "Project"],
      ["S148", "Phase 9 Assessment"]
    ]
  },

  {
    id: "P10",
    name: "Configuration Management با Ansible",
    track: "DevOps / SRE",
    sessions: [
      ["S149", "مفاهیم / Inventory / Idempotency"],
      ["S150", "Ad-hoc و Playbook"],
      ["S151", "Variables / Facts / Jinja2"],
      ["S152", "Handlers / Loops / Conditionals / Tags"],
      ["S153", "Roles و Collections"],
      ["S154", "Vault"],
      ["S155", "Hardening و User Management"],
      ["S156", "Testing — ansible-lint / Molecule"],
      ["S157", "AWX / Semaphore — Optional"],
      ["S158", "Project"],
      ["S159", "Phase 10 Assessment"]
    ]
  },

  {
    id: "P11",
    name: "CI/CD",
    track: "DevOps / SRE",
    sessions: [
      ["S160", "مفاهیم CI/CD"],
      ["S161", "GitHub Actions / GitLab CI"],
      ["S162", "Build / Test / Push Image"],
      ["S163", "Runners — Self-hosted"],
      ["S164", "Deployment Strategies"],
      ["S165", "Jenkins — Overview"],
      ["S166", "Artifact و Versioning"],
      ["S167", "Pipeline + Ansible Deploy"],
      ["S168", "Project"],
      ["S169", "Phase 11 Assessment"]
    ]
  },

  {
    id: "P12",
    name: "Cloud و Infrastructure as Code",
    track: "DevOps / SRE",
    sessions: [
      ["S170", "Cloud Fundamentals"],
      ["S171", "Compute و Storage"],
      ["S172", "VPC"],
      ["S173", "IAM"],
      ["S174", "S3 / RDS / ELB / ASG"],
      ["S175", "Cost و Well-Architected"],
      ["S176", "Terraform Basics"],
      ["S177", "State / Variables / Outputs"],
      ["S178", "Modules"],
      ["S179", "Remote State / Workspaces"],
      ["S180", "VPC + EC2 + ALB"],
      ["S181", "Packer — Optional"],
      ["S182", "IaC Testing / Policy"],
      ["S183", "Project"],
      ["S184", "Phase 12 Assessment"]
    ]
  },

  {
    id: "P13",
    name: "Kubernetes",
    track: "DevOps / SRE",
    sessions: [
      ["S185", "Kubernetes Architecture"],
      ["S186", "Local Cluster — kind / minikube"],
      ["S187", "Pods / ReplicaSets / Deployments"],
      ["S188", "Services و DNS"],
      ["S189", "Ingress / Gateway API"],
      ["S190", "ConfigMaps و Secrets"],
      ["S191", "PV / PVC / StorageClass"],
      ["S192", "Scheduling / Resources / Probes"],
      ["S193", "StatefulSet / DaemonSet / Jobs"],
      ["S194", "RBAC"],
      ["S195", "NetworkPolicy و CNI"],
      ["S196", "Helm"],
      ["S197", "Kustomize و GitOps — Argo CD"],
      ["S198", "Cluster با kubeadm"],
      ["S199", "Upgrade و Backup etcd"],
      ["S200", "Kubernetes Troubleshooting"],
      ["S201", "Project"],
      ["S202", "Phase 13 Assessment — سبک CKA"]
    ]
  },

  {
    id: "P14",
    name: "Observability",
    track: "DevOps / SRE",
    sessions: [
      ["S203", "سه ستون Observability و Golden Signals"],
      ["S204", "Prometheus و PromQL"],
      ["S205", "Alertmanager و Alert Design"],
      ["S206", "Grafana"],
      ["S207", "Logging — Loki / ELK"],
      ["S208", "Tracing — OpenTelemetry / Jaeger"],
      ["S209", "Kubernetes Observability"],
      ["S210", "Blackbox / Synthetic Monitoring"],
      ["S211", "Project"],
      ["S212", "Phase 14 Assessment"]
    ]
  },

  {
    id: "P15",
    name: "DevSecOps",
    track: "DevOps / SRE",
    sessions: [
      ["S213", "Shift-left و Threat Modeling"],
      ["S214", "SAST / Dependency Scanning / SBOM"],
      ["S215", "Container و IaC Scanning"],
      ["S216", "Secrets Management"],
      ["S217", "Supply Chain — cosign / SLSA"],
      ["S218", "Kubernetes Security"],
      ["S219", "Compliance as Code"],
      ["S220", "Project"],
      ["S221", "Phase 15 Assessment"]
    ]
  },

  {
    id: "P16",
    name: "SRE و Advanced Infrastructure",
    track: "DevOps / SRE",
    sessions: [
      ["S222", "SLI / SLO / Error Budget"],
      ["S223", "Incident Management / On-call / Postmortem"],
      ["S224", "HA — Keepalived / Pacemaker / Corosync / Patroni"],
      ["S225", "DR / RTO / RPO"],
      ["S226", "Capacity Planning و Load Testing"],
      ["S227", "Chaos Engineering"],
      ["S228", "Multi-region و DNS Failover"],
      ["S229", "Platform Engineering و Cost"],
      ["S230", "Project"],
      ["S231", "Phase 16 Assessment"]
    ]
  },

  {
    id: "P17",
    name: "Final Enterprise Capstone",
    track: "DevOps / SRE",
    sessions: [
      ["S232", "Architecture و Design Review"],
      ["S233", "ساخت مرحله‌ای I"],
      ["S234", "ساخت مرحله‌ای II"],
      ["S235", "ساخت مرحله‌ای III"],
      ["S236", "ساخت مرحله‌ای IV"],
      ["S237", "ساخت مرحله‌ای V"],
      ["S238", "Chaos / Incident Day"],
      ["S239", "Documentation و Demo"],
      ["S240", "Final Assessment + آمادگی مصاحبه / رزومه"]
    ]
  }

];
