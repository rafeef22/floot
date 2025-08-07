import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs";
import { ProductManagement } from "../components/ProductManagement";
import { SettingsManagement } from "../components/SettingsManagement";
import { LayoutDashboard, Settings } from "lucide-react";
import styles from "./admin.module.css";

export default function AdminPage() {
  return (
    <>
      <Helmet>
        <title>Admin Panel - CHAMP</title>
        <meta name="description" content="Admin panel for CHAMP website." />
      </Helmet>
      <div className={styles.adminContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>Admin Panel</h1>
          <p className={styles.subtitle}>
            Manage products, settings, and more.
          </p>
        </header>

        <Tabs defaultValue="products" className={styles.tabs}>
          <TabsList>
            <TabsTrigger value="products">
              <LayoutDashboard size={16} />
              Product Management
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings size={16} />
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="products" className={styles.tabContent}>
            <ProductManagement />
          </TabsContent>
          <TabsContent value="settings" className={styles.tabContent}>
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}