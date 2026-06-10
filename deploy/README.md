# SRE EDU OS — Deployment Guide

## Infrastructure

- **Cloud**: AWS (EKS + RDS PostgreSQL Multi-AZ + ElastiCache Redis + S3 + SES)
- **Container Orchestration**: Kubernetes (EKS 1.28)
- **CI/CD**: GitHub Actions
- **SSL**: cert-manager + Let's Encrypt
- **Ingress**: nginx-ingress-controller

## Quick Deploy

### 1. Create EKS Cluster
```bash
eksctl create cluster --name sre-edu-os-cluster --region ap-south-1 \
  --nodegroup-name workers --node-type t3.medium --nodes-min 2 --nodes-max 6 \
  --managed
```

### 2. Install nginx ingress + cert-manager
```bash
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace
helm upgrade --install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --set installCRDs=true
```

### 3. Create namespace + secrets
```bash
kubectl apply -f k8s/namespace.yml
cp k8s/secrets-template.yml k8s/secrets.yml
# Fill in all values in secrets.yml
kubectl apply -f k8s/secrets.yml
```

### 4. Deploy application
```bash
kubectl apply -f k8s/
kubectl rollout status deployment/sre-backend  -n sre-edu-os
kubectl rollout status deployment/sre-frontend -n sre-edu-os
```

### 5. Set up GitHub Actions secrets
Go to GitHub → Settings → Secrets and add:
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`
- `ECR_REPO_BACKEND` / `ECR_REPO_FRONTEND`
- `API_URL` → https://api.sreedos.com/api/v1

After that, every push to `main` triggers automated build + deploy.

## Rollback
```bash
kubectl rollout undo deployment/sre-backend  -n sre-edu-os
kubectl rollout undo deployment/sre-frontend -n sre-edu-os
```

## Monitoring
```bash
kubectl get pods -n sre-edu-os
kubectl logs -f deployment/sre-backend -n sre-edu-os
kubectl top pods -n sre-edu-os
```
