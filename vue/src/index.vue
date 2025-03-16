<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="生产商编号" prop="manufacturerId">
        <el-input
          v-model="queryParams.manufacturerId"
          placeholder="请输入生产商编号"
        />
      </el-form-item>
      <el-form-item label="生产商名称" prop="manufacturerName">
        <el-input
          v-model="queryParams.manufacturerName"
          placeholder="请输入生产商名称"
        />
      </el-form-item>
      <el-form-item label="产品编号" prop="productId">
        <el-input
          v-model="queryParams.productId"
          placeholder="请输入产品编号"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
        />
      </el-form-item>
      <el-form-item label="质检员编号" prop="inspectorId">
        <el-input
          v-model="queryParams.inspectorId"
          placeholder="请输入质检员编号"
        />
      </el-form-item>
      <el-form-item label="活动时间" prop="activityTime">
        <el-date-picker
          v-model="queryParams.activityTime"
          type="datetime"
          placeholder="请输入活动时间"
        />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="queryParams.address" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="生产日期" prop="productionDate">
        <el-date-picker
          v-model="queryParams.productionDate"
          type="date"
          placeholder="请输入生产日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </el-form-item>
    </el-form>

    <!-- 产品信息展示区域 -->
    <el-table :data="productInfoList" style="width: 100%">
      <el-table-column prop="manufacturerId" label="生产商编号" align="left" />
      <el-table-column prop="manufacturerName" label="生产商名称" align="left" />
      <el-table-column prop="productId" label="产品编号" align="left" />
      <el-table-column prop="productName" label="产品名称" align="left" />
      <el-table-column prop="inspectorId" label="质检员编号" align="left" />
      <el-table-column prop="activityTime" label="活动时间" align="left" />
      <el-table-column prop="address" label="地址" align="left" />
      <el-table-column prop="productionDate" label="生产日期" align="left" />
      <el-table-column prop="inspectionResult" label="质检结果" align="left" />
    </el-table>

    <!-- 接收方信息弹窗 -->
    <el-button type="primary" @click="receiverDialogVisible = true"
      >接收方信息</el-button
    >
    <el-dialog
      title="接收方信息"
      :visible.sync="receiverDialogVisible"
      width="600px"
      class="custom-dialog"
    >
      <el-form label-width="120px">
        <el-form-item label="接收方ID">
          <el-input v-model="receiverInfo.receiverId" readonly />
        </el-form-item>
        <el-form-item label="接收方公钥">
          <el-input v-model="receiverInfo.publicKey" readonly />
        </el-form-item>
        <el-form-item label="所属组织">
          <el-input v-model="receiverInfo.organization" readonly />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="receiverDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="receiverDialogVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <!-- 传输数据弹窗 -->
    <el-button type="primary" @click="transferDialogVisible = true"
      >传输数据</el-button
    >
    <el-dialog
      title="传输数据"
      :visible.sync="transferDialogVisible"
      width="500px"
    >
      <div>
        <el-button type="primary" @click="addTargetChain">添加目标链</el-button>
        <el-form>
          <div
            v-for="(item, index) in targetChains"
            :key="index"
            class="target-chain-item"
          >
            <div class="input-row">
              <div class="input-label">目标链：</div>
              <el-input v-model="item.target" placeholder="输入目标链" />
              <el-button type="primary" size="small" @click="verifyTargetChain(item)" style="margin-left: 10px">验证</el-button>
            </div>
            <div class="input-row">
              <div class="input-label">数据类型：</div>
              <el-input v-model="item.dataType" placeholder="数据类型" />
            </div>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleTransferConfirm"
          >确认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ProductInfo",
  data() {
    return {
      queryParams: {
        manufacturerId: "",
        manufacturerName: "",
        productId: "",
        productName: "",
        inspectorId: "",
        activityTime: "",
        address: "",
        productionDate: "",
      },
      receiverDialogVisible: false,
      transferDialogVisible: false,
      receiverInfo: {
        receiverId: "RCV_001",
        publicKey: "0x8F3E...7A2D",
        organization: "某某科技有限公司"
      },
      targetChains: [
        {
          target: "",
          dataType: "",
        },
      ],
      productInfoList: [
        {
          manufacturerId: '145768853791',
          manufacturerName: '煤业化工',
          productId: '84758459344834',
          productName: '煤炭123',
          inspectorId: 'QC001',
          activityTime: '2025-03-4 15:23',
          address: '陕西省 西安市',
          productionDate: '2025-03-02',
          inspectionResult: '合格'
        },
        {
          manufacturerId: '145768853792',
          manufacturerName: '化工集团',
          productId: '84758459344835',
          productName: '煤炭456',
          inspectorId: 'QC002',
          activityTime: '2025-03-4 16:23',
          address: '陕西省 咸阳市',
          productionDate: '2025-03-02',
          inspectionResult: '合格'
        },
        {
          manufacturerId: '145768853793',
          manufacturerName: '能源公司',
          productId: '84758459344836',
          productName: '煤炭789',
          inspectorId: 'QC003',
          activityTime: '2025-03-4 17:23',
          address: '陕西省 宝鸡市',
          productionDate: '2025-03-02',
          inspectionResult: '合格'
        }
      ],
    };
  },
  methods: {
    handleSubmit() {
      // 提交表单处理
      console.log(this.queryParams);
    },
    addTargetChain() {
      this.targetChains.push({
        target: "",
        dataType: "",
      });
    },
    handleTransferConfirm() {
      // 处理传输数据确认
      console.log(this.targetChains);
      this.transferDialogVisible = false;
    },
    verifyTargetChain(item) {
      if (!item.target) {
        this.$message.warning('请输入目标链');
        return;
      }
      // 这里添加验证目标链的逻辑
      this.$message.success('目标链验证成功');
    },
  },
};
</script>

<style scoped>
.target-chain-item {
  margin-top: 10px;
}
.input-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.input-label {
  width: 80px;
  text-align: right;
  padding-right: 10px;
}
.input-row .el-input {
  flex: 1;
}
:deep(.el-descriptions) {
  margin-top: 20px;
}
:deep(.el-descriptions__label) {
  width: 120px;
  justify-content: flex-end;
}
:deep(.custom-dialog) {
  .el-dialog__header {
    padding: 15px 20px;
    border-bottom: 1px solid #e4e7ed;
    margin: 0;
  }
  
  .el-dialog__body {
    padding: 20px;
  }

  .el-form-item {
    margin-bottom: 18px;
  }

  .el-form-item__label {
    font-weight: normal;
    color: #606266;
  }
}

.dialog-footer {
  text-align: right;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

:deep(.el-table) {
  margin-top: 20px;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 500;
  border-bottom: 1px solid #e4e7ed;
}

:deep(.el-table td) {
  color: #606266;
}
</style>
