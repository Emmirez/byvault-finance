// controllers/searchController.js
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

// Global search for admin
export const search = async (req, res) => {
  try {
    const { q } = req.query;

    
    if (!q || q.length < 2) {
      return res.json({ results: [] });
    }

    console.log(`🔍 Admin search query: "${q}"`);

    // Search users
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
        { accountId: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ]
    }).limit(5).select('name firstName lastName email username accountId phone');

    // Search transactions
    const transactions = await Transaction.find({
      $or: [
        { description: { $regex: q, $options: 'i' } },
        { transactionId: { $regex: q, $options: 'i' } },
        { type: { $regex: q, $options: 'i' } }
      ]
    }).limit(5).populate('user', 'name email');

    // Format results
    const results = [
      ...users.map(u => ({
        id: u._id,
        type: 'user',
        title: u.name || `${u.firstName} ${u.lastName}`.trim(),
        subtitle: `${u.email || u.phone || 'No contact'} • ${u.accountId?.slice(-4) || 'No ID'}`,
        url: `/admin/users/${u._id}`,
        icon: 'user'
      })),
      ...transactions.map(t => ({
        id: t._id,
        type: 'transaction',
        title: `${t.type} - $${t.amount?.toLocaleString() || 0}`,
        subtitle: `${t.user?.name || 'Unknown'} • ${t.transactionId?.slice(0, 8) || t._id?.toString().slice(0, 8)}...`,
        url: `/admin/transactions/${t._id}`,
        icon: 'transaction'
      }))
    ];

    // Also search KYC if you have KYC model
    // Uncomment if you have KYC model
    /*
    const KYC = mongoose.model('KYC');
    const kycs = await KYC.find({
      $or: [
        { 'personalInfo.fullName': { $regex: q, $options: 'i' } },
        { documentNumber: { $regex: q, $options: 'i' } },
        { status: { $regex: q, $options: 'i' } }
      ]
    }).limit(5).populate('user', 'name email');

    const kycResults = kycs.map(k => ({
      id: k._id,
      type: 'kyc',
      title: `KYC - ${k.personalInfo?.fullName || 'Unknown'}`,
      subtitle: `${k.status} • ${k.documentNumber?.slice(-4) || 'No doc'}`,
      url: `/admin/kyc/${k._id}`,
      icon: 'kyc'
    }));

    results.push(...kycResults);
    */

    console.log(`✅ Search found ${results.length} results`);

    res.json({ 
      success: true,
      results,
      total: results.length
    });
  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error during search",
      results: [] 
    });
  }
};

// Search users specifically
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ users: [] });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
        { accountId: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ]
    }).limit(10).select('-password');

    res.json({ 
      success: true,
      users 
    });
  } catch (error) {
    console.error("❌ User search error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error during user search",
      users: [] 
    });
  }
};

// Search transactions specifically
export const searchTransactions = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ transactions: [] });
    }

    const transactions = await Transaction.find({
      $or: [
        { description: { $regex: q, $options: 'i' } },
        { transactionId: { $regex: q, $options: 'i' } },
        { type: { $regex: q, $options: 'i' } }
      ]
    }).limit(10).populate('user', 'name email');

    res.json({ 
      success: true,
      transactions 
    });
  } catch (error) {
    console.error("❌ Transaction search error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error during transaction search",
      transactions: [] 
    });
  }
};