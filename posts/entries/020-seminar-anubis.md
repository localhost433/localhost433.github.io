---
title: Anubis, Containers, & Kubernetes
date: 2025-09-19
tags: [notes, cs]
author: R
location: Warren Weaver Hall, NYU, New York, NY
---

> BUGS $\times$ Anubis - “Anubis, Containers, & Open Source” (2025-09-19).

## What is Anubis?
- Open-source learning management system (LMS) created at NYU; used by ~2000 Tandon students.
- Focus: automate CS classes with **Cloud IDEs** (one-click, pre-configured per course) and **autograding** (CI/CD-style).
- Available to NYU via SSO; roles for professors, students, TAs; integrates multiple services into one experience.
- Funded by NYU Tandon CSE; **not** a startup and **won’t be monetized**.

## Why containers? (OSS & security)
- Bundle app + deps to run identically across machines.
- Resource controls via cgroups; easy microservice decomposition; connect via CNI.
- Isolation reduces cross-boundary leakage; “Linux starts in a container” mindset—skipping containers isn’t a performance win by itself (claim from slides).

## Anubis at scale
- Anubis is a microservice system; each service can run multiple containers.
- Snapshot (2023-02-07): about $\,\sim 366\,$ Cloud IDEs open ⇒ roughly $\,\sim 3000\,$ containers just for IDEs.

## Kubernetes stack (how Anubis runs)
- Orchestrated by **Kubernetes (k8s)**; extends networking (CNI) and storage (CSI) across many nodes.
- Deployed via **Helm** (install on any k8s cluster like a package).
- **Pod** = unit of work: containers + volumes + config maps + secrets.
- Runtime pathway highlighted in slides: kube -> containerd (CRI) -> containers.

## Cloud IDE design (per student)
- Each student gets an **IDE Pod** with an isolated filesystem (e.g., NFS-backed home volume mounted into the pod).
- **Resource limits** (CPU/RAM) enforced via cgroups.
- Each IDE uses $\ge 3$ containers:
  - **Init container**: clone repo, fix permissions.
  - **Theia IDE server**: web IDE + shell.
  - **Autosave sidecar**: background sync/saves.
  - **(New)** rootless **dockerd** sidecar -> “Docker inside IDEs.”
- Containers in a pod share `localhost`; home mounted at `/home/anubis`.

## “The Cloud” (framing from the talk)
- Cloud = fleets of physical servers renting VMs; programmatic creation/destruction enables elastic scaling.
- Virtualization vs containers: similar isolation goals; containers have much lower overhead for many workloads.

## Open-source posture
- Many small student contributions; frequent OSS security reviews (often via OSIRIS Lab).
- “Hardcore OSS” ethos; active GitHub presence.

## Roadmap highlights
- **Installable anywhere** via Helm: handle image hosting, SSO, and third-party services (cache, DB).
- **Forums**: Campuswire/Piazza-style Q&A + announcements to make Anubis a fuller CS-course platform.
- **Anticheat**: integrate **Mayat** (AST-based syntax fingerprinting) for plagiarism detection.

## People & projects to read
- Folks: Liz Rice, Jess Frazelle, Jérôme Petazzoni.
- Code (Go): **runC** (OCI), **containerd**, **kubernetes**.

## Speaker
- **John Cunniff** — NYU alum; former OSIRIS Lab president; creator/maintainer of Anubis; Senior Engineer & Partner at Vola Dynamics.
